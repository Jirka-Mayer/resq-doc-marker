import {
  RobotInterface,
  EvidenceExtractionRequest,
  EvidenceExtractionResponse,
  AnswerPredictionRequest,
  AnswerPredictionResponse,
} from "doc-marker";
import {
  DimbuAnswerPrediction,
  DimbuAnswerPredictionRequest,
  DimbuAnswerPredictionResponse,
  DimbuEvidenceExtractionRequest,
  DimbuEvidenceExtractionResponse,
  DimbuEvidencePrediction,
  DimbuEvidenceSingleAnswer,
  isSingleAnswer,
} from "./DimbuApiTypes";

// TODO: move this into a config
const DIMBU_URL = "https://quest.ms.mff.cuni.cz/dimbu";
// Thresholds set basd on the email from Vojtěch Lanz from 20th Aug 2025 with those charts
const EE_MINIMAL_QUESTION_CONFIDENCE = 0.5; // the model must perform well on this question
const EE_MINIMAL_QUESTION_FREQUENCY = 0.1; // the model must be well-enough-trained for the question
// We purposefully ignore the prediction_confidence, which is just the softmax value of the
// model for the specific inference data, because this value is hard to interpret.
const LIMIT_EVIDENCE_ANSWERS_TO = 5;
const AP_MINIMAL_QUESTION_CONFIDENCE = 0.8;
const AP_MINIMAL_QUESTION_FREQUENCY = 0.1;

// Swagger endpoint is at https://quest.ms.mff.cuni.cz/dimbu/docs

export class CuniNlpRobot implements RobotInterface {
  /**
   * Extracts a list of evidences for a single form field (a single question)
   */
  public async extractEvidences(
    request: EvidenceExtractionRequest,
    abortSignal: AbortSignal,
  ): Promise<EvidenceExtractionResponse> {
    const dimbuRequest: DimbuEvidenceExtractionRequest = {
      context: request.reportText,
      question_ids: [request.fieldId], // we always send exactly 1 question
      language: request.reportLanguage, // ISO 639 Language Code
      form_version: null, // Dimbu currently does not use this
    };
    const httpResponse = await fetch(DIMBU_URL + "/api/wp4/extract_evidences", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(dimbuRequest),
      signal: abortSignal,
    });

    if (!httpResponse.ok) {
      throw Error("Dimbu request resulted in a non 200-ok response.");
    }

    const dimbuResponse: DimbuEvidenceExtractionResponse =
      await httpResponse.json();

    if (dimbuResponse.predictions.length !== 1) {
      throw Error(
        "We expect 1 evidence prediction to be returned by the model.",
      );
    }
    const prediction: DimbuEvidencePrediction = dimbuResponse.predictions[0];

    if (prediction.question_id !== request.fieldId) {
      throw new Error(
        "We got back answer for a different field than what we asked for.",
      );
    }

    // build up metadata for later inspection
    const metadata = {
      question_confidence: prediction.question_confidence,
      question_frequency: prediction.question_frequency,
      no_additional_evidence_confidence:
        prediction.no_additional_evidence_confidence,
      answers: prediction.answers,
    };

    // if the prediction is not confident enough, pretend the model gave
    // up on answering:
    if (
      prediction.question_confidence <= EE_MINIMAL_QUESTION_CONFIDENCE ||
      prediction.question_frequency <= EE_MINIMAL_QUESTION_FREQUENCY
    ) {
      return {
        evidences: null, // no prediction (not the same as empty evidences!)
        metadata: metadata,
        modelVersion: dimbuResponse.model_version,
      };
    }

    // get answers as single-value answers (which is what they should be)
    const answers: DimbuEvidenceSingleAnswer[] = prediction.answers.map((a) => {
      if (isSingleAnswer(a)) {
        return a;
      } else {
        throw new Error("Not all evidence answers are of type 'single'.");
      }
    });

    // sort answers by confidence
    answers.sort((a, b) => a.prediction_confidence - b.prediction_confidence);

    // limit the number of answers
    while (answers.length > LIMIT_EVIDENCE_ANSWERS_TO) {
      answers.pop();
    }

    // construct the API response
    return {
      evidences: answers.map((a) => ({
        range: {
          index: a.answer_start,
          length: a.text.length,
        },
        text: a.text,
      })),
      metadata: metadata,
      modelVersion: dimbuResponse.model_version,
    };
  }

  /**
   * Attempts to predict an anwer for a form field (a question) given
   * the set of previously-extracted (or human-provided) evidences
   */
  public async predictAnswer(
    request: AnswerPredictionRequest,
    abortSignal: AbortSignal,
  ): Promise<AnswerPredictionResponse> {
    const dimbuRequest: DimbuAnswerPredictionRequest = {
      questions: [
        {
          question_id: request.fieldId,
          evidences: request.evidences.map((e) => e.text),
        },
      ],
      language: request.reportLanguage, // ISO 639 Language Code
      form_version: null, // Dimbu falls back to the latest form it know about
    };
    const httpResponse = await fetch(DIMBU_URL + "/api/wp4/predict_answers", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(dimbuRequest),
      signal: abortSignal,
    });

    if (!httpResponse.ok) {
      throw Error("Dimbu request resulted in a non 200-ok response.");
    }

    const dimbuResponse: DimbuAnswerPredictionResponse =
      await httpResponse.json();

    if (dimbuResponse.predictions.length !== 1) {
      throw Error("We expect 1 answer prediction to be returned by the model.");
    }
    const prediction: DimbuAnswerPrediction = dimbuResponse.predictions[0];

    if (prediction.question_id !== request.fieldId) {
      throw new Error(
        "We got back answer for a different field than what we asked for.",
      );
    }

    // build up metadata for later inspection
    const metadata = {
      question_confidence: prediction.question_confidence,
      question_frequency: prediction.question_frequency,
      enumeration_value_id: prediction.enumeration_value_id,
      prediction_confidence: prediction.prediction_confidence,
      status: prediction.status,
    };

    // if there's a parsing issue or low confidence, reject the value
    // and pretend the model did not provide an answer:
    if (
      prediction.status !== "success" ||
      prediction.question_confidence <= AP_MINIMAL_QUESTION_CONFIDENCE ||
      prediction.question_frequency <= AP_MINIMAL_QUESTION_FREQUENCY
    ) {
      return {
        answer: undefined, // undefined corresponds to "empty field",
        // while null would mean "the value is explicitly not known"
        metadata: metadata,
        modelVersion: dimbuResponse.model_version,
      };
    }

    // construct the API response
    return {
      answer: prediction.enumeration_value_id,
      metadata: metadata,
      modelVersion: dimbuResponse.model_version,
    };
  }
}
