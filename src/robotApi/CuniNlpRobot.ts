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

// TODO: on abort signal return null, not throw error

// Swagger endpoint is at https://quest.ms.mff.cuni.cz/dimbu/docs

/**
 * An awaitable variant of the setTimeout function.
 * Usage: await timeoutAsync(500);
 */
function timeoutAsync(delay?: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export class CuniNlpRobot implements RobotInterface {
  /**
   * Process at most 10 fields at a time (in parallel)
   * Which is the batch size sent to the Dimbu server
   */
  public readonly maxFieldRequestConcurrency: number = 5;

  /**
   * Extracts a list of evidences for a single form field (a single question)
   */
  public async extractEvidences(
    request: EvidenceExtractionRequest,
    abortSignal: AbortSignal,
  ): Promise<EvidenceExtractionResponse | null> {
    const dimbuResponse = await this.fetchEvidenceExtraction(
      {
        context: request.reportText,
        question_ids: [request.fieldId], // we always send exactly 1 question
        language: request.reportLanguage, // ISO 639 Language Code
        form_version: null, // Dimbu currently does not use this
      },
      abortSignal,
    );

    // graceful aborting
    if (dimbuResponse === null) {
      return null;
    }

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
   * Sends the HTTP fetch request, returns null on abort and throws on failure
   */
  private async fetchEvidenceExtraction(
    request: DimbuEvidenceExtractionRequest,
    abortSignal: AbortSignal,
  ): Promise<DimbuEvidenceExtractionResponse | null> {
    try {
      for (let tries = 0; tries <= 5; tries++) {
        // wait 0s, 2s, 4s, 8s, 16s, 32s before re-try (for 429 responses)
        if (tries > 0) {
          await timeoutAsync((2 << (tries - 1)) * 1_000);
        }

        const httpResponse = await fetch(
          DIMBU_URL + "/api/wp4/extract_evidences",
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(request),
            signal: abortSignal,
          },
        );

        if (!httpResponse.ok) {
          throw Error("Dimbu request resulted in a non 200-ok response.");
        }

        if (httpResponse.status === 429) {
          continue; // re-try
        }

        return (await httpResponse.json()) as DimbuEvidenceExtractionResponse;
      }
    } catch (e) {
      // abortion should be graceful
      if (abortSignal.aborted) {
        return null;
      }
      throw e;
    }

    // this calms down return-value typescript checks
    throw new Error("This line should not be executed.");
  }

  /**
   * Attempts to predict an anwer for a form field (a question) given
   * the set of previously-extracted (or human-provided) evidences
   */
  public async predictAnswer(
    request: AnswerPredictionRequest,
    abortSignal: AbortSignal,
  ): Promise<AnswerPredictionResponse | null> {
    const dimbuResponse = await this.fetchAnswerPrediction(
      {
        questions: [
          {
            question_id: request.fieldId,
            evidences: request.evidences.map((e) => e.text),
          },
        ],
        language: request.reportLanguage, // ISO 639 Language Code
        form_version: null, // Dimbu falls back to the latest form it know about
      },
      abortSignal,
    );

    // graceful aborting
    if (dimbuResponse === null) {
      return null;
    }

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

  /**
   * Sends the HTTP fetch request, returns null on abort and throws on failure
   */
  private async fetchAnswerPrediction(
    request: DimbuAnswerPredictionRequest,
    abortSignal: AbortSignal,
  ): Promise<DimbuAnswerPredictionResponse | null> {
    try {
      for (let tries = 0; tries <= 5; tries++) {
        // wait 0s, 2s, 4s, 8s, 16s, 32s before re-try (for 429 responses)
        if (tries > 0) {
          await timeoutAsync((2 << (tries - 1)) * 1_000);
        }

        const httpResponse = await fetch(
          DIMBU_URL + "/api/wp4/predict_answers",
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(request),
            signal: abortSignal,
          },
        );

        if (!httpResponse.ok) {
          throw Error("Dimbu request resulted in a non 200-ok response.");
        }

        if (httpResponse.status === 429) {
          continue; // re-try
        }

        return (await httpResponse.json()) as DimbuAnswerPredictionResponse;
      }
    } catch (e) {
      // abortion should be graceful
      if (abortSignal.aborted) {
        return null;
      }
      throw e;
    }

    // this calms down return-value typescript checks
    throw new Error("This line should not be executed.");
  }
}
