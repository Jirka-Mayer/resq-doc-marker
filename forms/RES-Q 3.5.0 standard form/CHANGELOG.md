# RES-Q Stroke form Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Removed

### Fixed

### Deprecated

### Security

## [3.5.0] 2026-05-05

### Added

- soft rules:
  - *admission.medical_examination.systolic_pressure* >= *admission.medical_examination.diastolic_pressure*
  - *diagnosis.imaging.imaging_timestamp* >= *admission.admission_timestamp*
  - *treatment.thrombolysis.bolus_timestamp* >= *diagnosis.imaging.imaging_timestamp*
  - *treatment.ischemic_stroke.thrombectomy_transfer_timestamp* >= *diagnosis.imaging.imaging_timestamp*
  - *treatment.ischemic_stroke.puncture_timestamp* >= *diagnosis.imaging.imaging_timestamp*
  - *treatment.intracerebral_hemorrhage.initiation_timestamp* >= *diagnosis.imaging.imaging_timestamp*
  - *treatment.intracerebral_hemorrhage.evacuation_timestamp* >= *diagnosis.imaging.imaging_timestamp*
- hard rules:
  - *discharge.discharge_date* >= *onset.onset_date*
  - *admission.admission_timestamp* >= *onset.sleep_timestamp*
  - *treatment.thrombolysis.bolus_timestamp* >= *admission.admission_timestamp*
  - *treatment.ischemic_stroke.thrombectomy_transfer_timestamp* >= *admission.admission_timestamp*
  - *treatment.ischemic_stroke.puncture_timestamp* >= *admission.admission_timestamp*
  - *treatment.ischemic_stroke.reperfusion_timestamp* >= *treatment.ischemic_stroke.puncture_timestamp*
  - *treatment.intracerebral_hemorrhage.antihypertensive_timestamp* >= *admission.admission_timestamp*
  - *treatment.intracerebral_hemorrhage.systolic_below_140_timestamp* >= *treatment.intracerebral_hemorrhage.antihypertensive_timestamp*
  - *treatment.intracerebral_hemorrhage.initiation_timestamp* >= *admission.admission_timestamp*
  - *treatment.intracerebral_hemorrhage.evacuation_timestamp* >= *admission.admission_timestamp*

- *additionalProperties: false* parameter to every object in the schema
- boolean risk for alcohol_overuse as *anamnesis.risk_factors.alcohol_overuse*
- enum option bleeding in *treatment.ischemic_stroke.no_thrombolysis_reasons*
- enum option anticoagulant in *treatment.ischemic_stroke.no_thrombolysis_reasons*
- enum option against_medical_advice in *discharge.destination.discharge_destination*

### Changed

### Removed

- enum option cost in *treatment.ischemic_stroke.no_thrombolysis_reasons*
- enum option transferred in *treatment.ischemic_stroke.no_thrombolysis_reasons*

### Fixed

- added required for any_occlusion for IS and mimics stroke types if imaging was done

### Deprecated

### Security

## [3.4.0] - 2025-12-02

### Added

- enum option not_reported in *treatment.intracerebral_hemorrhage.no_neurosurgery_reason*
- enum option not_reported in *treatment.intracerebral_hemorrhage.no_anticoagulant_reversal_reason*
- enum option lesion_developed in *treatment.ischemic_stroke.no_thrombolysis_reasons*
- enum option disability in *treatment.ischemic_stroke.no_thrombolysis_reasons*
- enum option low_aspects in *treatment.ischemic_stroke.no_thrombectomy_reasons*
- new question for brand of tenecteplase which is shown when tenecteplase is selected (*treatment.thrombolysis.tenecteplase_brand*)

### Changed

### Removed

### Fixed

### Deprecated

### Security

## [3.3.1] - 2025-06-06

Changes in UI schema only

## [3.3.0] - 2025-06-06

This form version is based on the form 3.2.2

### Added

### Changed

### Removed

### Fixed

- *discharge* object as required
- objects *post_acute_care.vte*, *post_acute_care.swallowing*, *post_acute_care.fever*, *post_acute_care.hyperglycemia*
  *post_acute_care.post_stroke_complication*, *discharge.medication* is required  if any of their childs are required

### Deprecated

### Security

## [3.2.3] - 2025-06-06

This form version is based on the form 3.2.1

### Added

### Changed

### Removed

### Fixed

- *discharge* object as required
- objects *post_acute_care.vte*, *post_acute_care.swallowing*, *post_acute_care.fever*, *post_acute_care.hyperglycemia*
  *post_acute_care.post_stroke_complication* are conditionaly required (because of their required child objects)

### Deprecated

### Security

## [3.2.2] - 2025-03-24

### Added

- risk factor *anamnesis.risk_factors.sleep apnea* option
- swallowing test *post_acute_care.swallow.swallowing_screening_type* option *vvst*

### Changed

- advanced hiding logic for treatment part of the form if questions are filled and then stroke type is changed
- improved hiding/showing logic for other sections of form too
- IVT drug dose field was changed from integer to number because some drugs need real numbers

### Removed

- risk factor *hiv* (*anamnesis.risk_factors.hiv*)
- risk factor *covid* (*anamnesis.risk_factors.covid*)

### Fixed

- fixed a hiding issue introduced by ICH form extensions for stroke types without mandatory questions (TIA and Undetermined). Selecting before onset anticoagulants blocked the Submit button
- fixed AIS thrombectomy being able to be submitted even if no answer is filled
- fixed SAH stroke type when selected showing second and third question as non-mandatory

## [3.2.1] - 2024-09-24

### Changed

- property *post_acute_care.post_neurosurgery_imaging* is now shown no matter if neurosurgery was done or not. Same for all dependencies (follow-up volume, hydrocephalus and shunt placed)
- property *diagnosis.imaging.occlussion* is now shown also for regular CT or MR options. Not just angiography ones (CTA, MRA, CTA_perf, MRA_perf).
- property *treatment.ischemic_stroke.thrombectomy_treatment* is now shown also for regular CT and MR options like *diagnosis.imaging.occlussion* property. It is still required for *treatment.ischemic_stroke.thrombectomy_treatment* to be shown to have Yes for *diagnosis.imaging.occlussion.any_occlussion* found.

## [3.2.0] - 2024-08-30

### Added

- property *post_acute_care.stroke_etiology.etiology_category* of enum type with following options: *la_atherosclerosis*, *cardioembolism*, *lacunar*, *cryptogenic* and *other*
- property *post_acute_care.stroke_etiology.other_determined_etiology* of enum type with following options: *vasculitis*, *dissection*, *coagulation_system_disorders*, *hematological_disorders*, *fibromuscular_dysplasia*, *reversible_cerebral_vasoconstriction_syndromes*, *radiation_induced_vasculopathy*, *moyamoya_disease*, *fabrys_disease*, *cadasil*, *giant_cell_arteritis*, *antiphospholipid_syndrome*, *sickle_cell_anemia*, *migrainous_stroke*, *cerebral_venous_sinus_thrombosis*
- property *admission.medical_examination.inr_level* of integer type
- nullable property *treatment.intracerebral_hemorrhage.last_dose_noac* of date-time format, required if onset medication contains dabigatran, apixaban, edoxaban or rivaroxaban
- nullable property *treatment.intracerebral_hemorrhage.antihypertensive_given* of boolean type, required if *stroke_type*= *ich*
- nullable property *treatment.intracerebral_hemorrhage.antihypertensive_timestamp* of date-time format, required if  *antihypertensive_given* is *true*
- nullable property *treatment.intracerebral_hemorrhage.systolic_below_140* of boolean type, required if *admission.medical_examination.systolic_pressure* is 140 or higher and *stroke_type*= *ich*
- nullable property *treatment.intracerebral_hemorrhage.systolic_below_140_timestamp* of date-time format, required if *systolic_below_140* is *true*
- two options added to property *treatment.intracerebral_hemorrhage.bleeding_reason*: *cvt* and *brain_tumor*
- three options added to property *treatment.intracerebral_hemorrhage.treatment*: *hematoma_evacuation_minimal*, *hematoma_evacuation_open*, *aspiration*
- five options added to property *treatment.intracerebral_hemorrhage.anticoagulant_reversal* (in former versions *bleeding_antidote*): *vitaminK*, *protamine*, *tranexamic*, *aminocaproic*, *ciraparantag*
- property *treatment.intracerebral_hemorrhage.no_anticoagulant_reversal_reason* of enum type with following options: *consent*,*cost*,*not_available*,*not_licenced*,*criteria_not_met* and *no_pill*, required if *anticoagulant_reversal* = *none*
- property *treatment.intracerebral_hemorrhage.no_neurosurgery_reason* of enum type with following options: *size*,*location*,*consent*,*cost*,*facility_na*,*specialist_na*, *poor_prognosis* and *other*, required if *treatment.intracerebral_hemorrahage.treatment.any_treatment* = *false*
- nullable property *treatment.intracerebral_hemorrhage.evacuation_timestamp* of date-time format, required if *hematoma_evacuation_minimal*, *hematoma_evacuation_open* or *aspiration* is *true*
- nullable property *post_acute_care.highest_systolic* of integer type, required if *stroke_type*=*ich*
- nullable property *post_acute_care.hyperglycemia.highest_glucose* of real number type, required if *stroke_type* is one of *is*, *ich*, *tia* or *undetermined*
- property *post_acute_care.post_neurosurgery_imaging* of enum type with following options: *ct*, *mr*, *no*
- property *post_acute_care.bleeding_volume_control* of integer type (in ml)
- property *post_acute_care.hydrocephalus* of boolean type
- property *post_acute_care.shunt_placed* of boolean type
- one option added to *post_acute_care.post_stroke_complications*: *falling*
- nullable property *discharge.glucose* of real number type, required if s*stroke_type*=*ich*
- nullable property *discharge.systolic_pressure* of real number type, required if s*stroke_type*=*ich*
- property *treatment.intracerebral_hemorrhage.hemorrhage_location* of enum single-select type with following options: *supratentorial*, *infratentorial*, required if *stroke_type*=*ich*
- property *treatment.intracerebral_hemorrhage.hemorrhage_additional_location* with options: *intraventricular*, *subarachnoid*, required if *stroke_type*=*ich* and *hemorrhage_additional_location_found* is true

### Changed

- rename property *bleeding_antidote* to *anticoagulant_reversal*
- property *anticoagulant_reversal* is shown also if anticoagulant group is selected for medication on onset.
- property *post_acute_care.hyperglycemia.insulin_on_hyperglycemia* is required if *stroke_type* is one of *is*, *ich*, *tia* or *undetermined*
- property option *treatment.intracerebral_hemorrhage.anticoagulant_reversal* *andexanete* corrected to *andexanet*. Label changed to **Andexanet alfa**

### Removed

- property *post_acute_care.hyperglycemia.hyperglycemia_diagnosed*
- property *treatment.intracerebral_hemorrhage.bleeding_source_found*
- property *treatment.intracerebral_hemorrhage.treatment.hematoma_evacuation*
- property *post_acute_care.stroke_etiology.any_stroke_etiology*
- property *post_acute_care.stroke_etiology.la_atherosclerosis*
- property *post_acute_care.stroke_etiology.cardioembolism*
- property *post_acute_care.stroke_etiology.other*
- property *post_acute_care.stroke_etiology.cryptogenic_stroke*
- property *post_acute_care.stroke_etiology.lacunar*
- property *treatment.intracerebral_hemorrhage.infratentorial_hemorrhage*
- property *treatment.intracerebral_hemorrhage.intraventricular_hemorrhage*

## [3.1.8] - 2024-06-18

### Fixed

- property treatment.intracerebral_hemorrhage.bleeding_antidote is required ONLY if treatment.intracerebral_hemorrhage.bleeding_reason is anticolagulant

## [3.1.7] - 2024-04-17

### Added

- optional property treatment.intracerebral_hemorrhage.initiation_timestamp of date-time format

### Changed

- property discharge.destination is required
- property treatment.intracerebral_hemorrhage.bleeding_antidote is required if treatment.intracerebral_hemorrhage.bleeding_reason is anticolagulant

## [3.1.6] - 2024-02-13

### Changed

- property discharge.destination is required

## [3.1.5]

### Changed

- options of carotid_stenosis: add 1to49 and occlusion, rename over70 to 70to99
- split onset_timestamp into onset_time and onset_date

### Removed

- default value of ems_prenotification

## [3.1.4]

### Changed

- discharge mRS and NIHSS is not required for stroke_type mimics
- thrombolyses_treatment is required also for stroke_type mimics
- stroke_mimics diagnosis is required only for stroke_type mimics
- no_thrombolysis_reasons is required only for stroke_type is (not for mimics)

### Fixed

- transfer_timestamp is not required for ischemic thrombolised patients without occlusion

## [3.1.3]

### Added

- option speech_therapist to swallowing_screening_performer

### Changed

- discharge mRS and NIHSS are now mandatory. mRS has option "not assessed" and NIHSS is clickable off
- maximum limits for Glucose set to 700, Cholesterol 500 based on values in mg/dL unit provided by Sung-Il
- renamed hemorragic_transformation and hemorragic_transformation_type to hemorrhagic_transformation resp. hemorrhagic_transformation_type
- post_recanalization_imaging findings refactored to multiselect of three options: brain_infarct, remote_bleeding and hemorragic_transformation, hemorragic_transformation has also a type
- smoking_cessation_recommended changed from enum to boolean, therefore option not_smoker has been remove (smoking is in risk factors)

### Fixed

- reperfusion time is not required if mTICI score is 0

### Deprecated

## [3.1.2]

### Added

- no_anticoagulant_reasons group into discharge medication
- vte to risk factors in anamnesis
- options gp_ems and gp_private to admission arrival_mode

### Changed

- location of old_infarcts is not required
- added translations for all language dictionaries for the new no_anticoagulant_reasons group
- simplification of subarachnoid_hemorrhage.hunt_hess_score enum values
- post recanalization imaging findings is required only if post recanalization imaging is done
- 24_hour_hospitalized_time changed from enum to boolean
- discharge_destination is always required
- set default values to all multiselects
- change limits of systolic_pressure to *minimum*=40 and *maximum*=300
- change limits of diastolic_pressure to *minimum*=20 and *maximum*=150
- change limits of cholesterol to *minimum*=0 and *maximum*=15
- change limits of glucose to *minimum*=0.5 and *maximum*=30
- bleeding_volume can be null
- symptoms_duration for TIA is can be null
- set bleeding_volume *minimum*=0 and *maximum*=300
- set drug_dose for alteplase to *minimum*=0 and *maximum*=90 and for the other drugs to *minimum*=0 and *maximum*=500

### Removed

- anticoagulant_recommended option removed from discharge medication
- bleeding_source_found default value

## [3.1.1]

### Added

- unknown option to sex
- other to antiplatelet_substances
- other to anticoagulant_substances

### Changed

- minimal value 0 to cholesterol and glucose
- discharge group name changed from group.discharge to group.discharge.main
- maximum discharge mRS is 5

## [3.1.0]

### Added

- Initial version

