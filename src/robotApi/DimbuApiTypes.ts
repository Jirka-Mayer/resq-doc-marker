// Type definitions taken from swagger at:
// https://quest.ms.mff.cuni.cz/dimbu/docs
// and the descriptions provided in the "CUNI NLP Service API Specification"
// google docs document created by Vojtěch Lanz.

/////////////////////////
// Evidence Extraction //
/////////////////////////

export interface DimbuEvidenceExtractionRequest {
  /**
   * The clinical report text containing the evidences.
   */
  readonly context: string;

  /**
   * A list of question IDs for which evidence spans are to be predicted.
   */
  readonly question_ids: string[];

  /**
   * The language code of the report text.
   */
  readonly language: string;

  /**
   * [OPTIONAL]: Specifies the version of the form used in the
   * annotation tool. This field is currently reserved for
   * future use and has no functional impact.
   */
  readonly form_version: string | null;
}

export interface DimbuEvidenceExtractionResponse {
  /**
   * A list of predictions, corresponding to the questions in the request.
   */
  readonly predictions: DimbuEvidencePrediction[];

  /**
   * Model used to generate this prediction.
   */
  readonly model_version: string;
}

export interface DimbuEvidencePrediction {
  /**
   * The question ID.
   */
  readonly question_id: string;

  /**
   * Confidence score for the question based on the evaluation test set.
   */
  readonly question_confidence: number;

  /**
   * Normalized number of samples used for question confidence
   * estimation - number of occurrences of this question id
   * in the test set divided by the number of test set reports.
   */
  readonly question_frequency: number;

  /**
   * Confidence score of the model’s prediction
   * that there is no other evidence in the report.
   */
  readonly no_additional_evidence_confidence: number;

  /**
   * List of alternative answers
   */
  readonly answers: DimbuEvidenceAnswer[];
}

export type DimbuEvidenceAnswerType = "single" | "complex";

export interface DimbuEvidenceAnswer {
  /**
   * Answer type - single (one answer) or complex (more complementary answers)
   * specifying whether other fields in this answers object are values
   * or arrays of values
   */
  readonly answer_type: DimbuEvidenceAnswerType;
}

export interface DimbuEvidenceSingleAnswer extends DimbuEvidenceAnswer {
  /**
   * Character offset of the evidence span.
   */
  readonly answer_start: number;

  /**
   * Extracted evidence text.
   */
  readonly text: string;

  /**
   * Confidence score of the model’s prediction.
   */
  readonly prediction_confidence: number;
}

export interface DimbuEvidenceComplexAnswer extends DimbuEvidenceAnswer {
  /**
   * Character offset of the evidence span.
   */
  readonly answer_start: number[];

  /**
   * Extracted evidence text.
   */
  readonly text: string[];

  /**
   * Confidence score of the model’s prediction.
   */
  readonly prediction_confidence: number[];
}

/**
 * Typescript type guard for the "single" evidence answer
 */
export function isSingleAnswer(
  answer: DimbuEvidenceAnswer,
): answer is DimbuEvidenceSingleAnswer {
  return answer.answer_type === "single";
}

/**
 * Typescript type guard for the "complex" evidence answer
 */
export function isComplexAnswer(
  answer: DimbuEvidenceAnswer,
): answer is DimbuEvidenceComplexAnswer {
  return answer.answer_type === "complex";
}

///////////////////////
// Answer Prediction //
///////////////////////

export interface DimbuAnswerPredictionRequest {
  /**
   * A list of questions
   */
  readonly questions: DimbuQuestionEvidence[];

  /**
   * The language code of the evidences (of the original report text).
   */
  readonly language: string;

  /**
   * [OPTIONAL]: Specifies the version of the form used in the annotation
   * tool. The model predicts answers based on the predefined options
   * for the specified form version. If no version is provided or if
   * the specified version is not supported, the most recent version
   * that includes the given question ID is used.
   * Supported versions:
   * {"3.2.1", "3.2.0", "3.1.8", "3.1.7", "3.1.6", "3.1.5", "3.1.4",
   * "3.1.3", "3.1.2_ontotext", "3.1.2", "3.1.1"}
   */
  readonly form_version: string | null;
}

export interface DimbuQuestionEvidence {
  /**
   * The question ID
   */
  readonly question_id: string;

  /**
   * List of evidences needed to answer the question.
   */
  readonly evidences: string[];
}

export interface DimbuAnswerPredictionResponse {
  /**
   * A list of predicted answers, corresponds to the questions in the request.
   */
  readonly predictions: DimbuAnswerPrediction[];

  /**
   * Model used to generate this prediction.
   */
  readonly model_version: string;
}

export interface DimbuAnswerPrediction {
  /**
   * The question ID.
   */
  readonly question_id: string;

  /**
   * Confidence score for the question based on the evaluation test set.
   */
  readonly question_confidence: number;

  /**
   * Normalized number of samples used for question confidence
   * estimation - number of occurrences of this question id
   * in the test set divided by the number of test set reports.
   */
  readonly question_frequency: number;

  /**
   * The predicted RES-Q form answer in its official form.
   */
  readonly enumeration_value_id: string | number | boolean | null;

  /**
   * Confidence score of the model’s prediction.
   */
  readonly prediction_confidence: number;

  /**
   * Status of the prediction process. ‘success’ for successful
   * prediction and parsing, ‘ParssingError’ when a parsing error
   * occurs during the parsing process of the predicted answer
   * (eventually any other type of an error).
   */
  readonly status: string;
}
