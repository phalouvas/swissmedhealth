frappe.ready(function () {

	let params = new URLSearchParams(window.location.search);
	let email_id = params.get('email_id');
	if (email_id) {
		frappe.call('swissmedhealth.swissmedhealth.web_form.patient_longevity_form_2.patient_longevity_form_2.get_longevity_history_details', { email_id: email_id }).then(r => {
			let doc = r.message;

			frappe.web_form.set_values(doc);
			frappe.web_form.is_new = false;
			frappe.web_form.doc.name = doc.name;
		});
	} else {
		// redirect to home page
		window.location.href = '/';
	}

	// Function to validate form sections
	function validateFormSections() {
		let validationErrors = [];
		
		// Define validation groups with their checkbox fields and other field
		const validationGroups = [
			{
				name: "Longevity & Health Goals",
				checkboxes: [
					'increase_energy_levels', 'improve_cognitive_function', 'enhance_physical_performance_and_mobility',
					'slow_down_biological_aging', 'improve_sleep_quality', 'reduce_inflammation_and_oxidative_stress',
					'prevent_age_related_diseases', 'reduce_stress'
				],
				otherField: 'goals_other'
			},
			{
				name: "Biological/Metabolic Age Tracking",
				checkboxes: ['track_yes', 'track_no'],
				otherField: null
			},
			{
				name: "Longevity-related Tests",
				checkboxes: [
					'dna_methylation_test', 'biological_age_test', 'hormone_panel', 'advanced_lipid_panel',
					'inflammation_markers', 'insulin_sensitivity_test', 'gut_microbiome_analysis',
					'mitochondrial_function_test', 'heavy_metal_test', 'no_answer_tests'
				],
				otherField: 'tests_other'
			},
			{
				name: "Longevity-based Diet",
				checkboxes: [
					'mediterranean_diet', 'ketogenic_low_carb_diet', 'intermittent_fasting_or_time_restricted_eating',
					'plant_based_diet', 'no_answer_diet'
				],
				otherField: 'diet_other'
			},
			{
				name: "Daily Fasting Hours",
				checkboxes: ['less_than_10_hours', '10_12_hours', '12_16_hours', 'more_than_16_hours'],
				otherField: null
			},
			{
				name: "Protein Sources",
				checkboxes: ['plant_based', 'animal_based', 'combination_of_both'],
				otherField: null
			},
			{
				name: "Sleep Hours per Night",
				checkboxes: ['less_than_5_hours', '5_6_hours', '7_8_hours', 'more_than_8_hours'],
				otherField: null
			},
			{
				name: "Sleep Quality Rating",
				checkboxes: ['very_bad_i_wake_up_every_2_3_hours', 'bad_i_wake_up_1_2_times_per_night', 'ok', 'good'],
				otherField: null
			},
			{
				name: "Morning Energy Level",
				checkboxes: ['morning_yes', 'morning_no'],
				otherField: null
			},
			{
				name: "Sleep Optimization Strategies",
				checkboxes: [
					'blue_light_blocking_glasses', 'meditation_or_relaxation_techniques', 'sleep_supplements',
					'cold_exposure_before_bed', 'no_answer_sleep'
				],
				otherField: 'sleep_optimize_other'
			},
			{
				name: "Exercise Routines",
				checkboxes: [
					'resistance_training', 'cardiovascular_training', 'body_posture_optimisation', 
					'high_intensity_interval_training', 'yoga_pilates', 'no_answer_exercise'
				],
				otherField: 'exercise_other'
			},
			{
				name: "Exercise Routines",
				checkboxes: [
					'resistance_training', 'cardiovascular_training', 'body_posture_optimisation', 
					'high_intensity_interval_training', 'yoga_pilates', 'no_answer_exercise'
				],
				otherField: 'exercise_other'
			},
			{
				name: "Medical & Metabolic History",
				checkboxes: [
					'cardiovascular_disease', 'diabetes_or_insulin_resistance', 'neurodegenerative_conditions',
					'osteoporosis_or_osteopenia', 'autoimmune_disorders', 'cancer', 'hormonal_imbalances',
					'chronic_inflammation_or_metabolic_dysfunction'
				],
				otherField: 'metaboli_history_other'
			},
			{
				name: "Supplements & Medications",
				checkboxes: [
					'nad_precursors', 'metformin_or_berberine', 'rapamycin', 'resveratrol_quercetin',
					'collagen_or_hyaluronic_acid', 'omega_3', 'no_answer_medication'
				],
				otherField: 'supplements_other'
			},
			{
				name: "Longevity Therapies",
				checkboxes: [
					'hyperbaric_oxygen_therapy', 'ozone_therapy', 'peptide_therapy', 'stem_cell_therapy',
					'cryotherapy_or_cold_exposure_therapy', 'no_answer_therapies'
				],
				otherField: 'therapies_other'
			},
			{
				name: "Health Monitoring",
				checkboxes: [
					'blood_glucose_levels', 'heart_rate_variability', 'sleep_quality',
					'body_composition', 'no_answer_monitor'
				],
				otherField: 'monitor_other'
			},
			{
				name: "Environmental Toxin Exposure",
				checkboxes: ['mercury', 'lead', 'mold_toxicity', 'no_answer_toxins'],
				otherField: 'toxins_other'
			},
			{
				name: "Toxin Exposure Reduction Measures",
				checkboxes: [
					'air_purification_at_home', 'filtered_water', 'organic_diet',
					'regular_sauna_use_for_detoxification', 'no_answer_toxin_exposure'
				],
				otherField: 'toxin_measure_other'
			},
			{
				name: "Stress Levels",
				checkboxes: ['low', 'moderate', 'high'],
				otherField: null
			},
			{
				name: "Stress Management Strategies",
				checkboxes: [
					'meditation_or_mindfulness_practices', 'breathing_exercises', 'regular_exercise',
					'social_engagement_and_relationships', 'professional_therapy_or_coaching'
				],
				otherField: 'stress_other'
			},
			{
				name: "Emotional & Mental Well-being",
				checkboxes: [
					'emotionally_balanced', 'occasionally_stressed', 'frequently_overwhelmed',
					'struggling_emotionally', 'seeking_support'
				],
				otherField: null
			},
			{
				name: "Social Connections",
				checkboxes: [
					'i_have_strong_and_meaningful_relationships', 'social_connection_check',
					'i_often_feel_socially_isolated_or_disconnected'
				],
				otherField: null
			},
			{
				name: "Social Activities Frequency",
				checkboxes: ['daily', 'a_few_times_a_week', 'a_few_times_a_month', 'rarely_or_never'],
				otherField: null
			}
		];

		// Check each validation group
		validationGroups.forEach(group => {
			let hasCheckedBox = false;
			let hasOtherText = false;

			// Check if any checkbox is selected
			group.checkboxes.forEach(fieldName => {
				if (frappe.web_form.doc[fieldName] == 1) {
					hasCheckedBox = true;
				}
			});

			// Check if other field has text (if exists)
			if (group.otherField && frappe.web_form.doc[group.otherField] && 
				frappe.web_form.doc[group.otherField].trim() !== '') {
				hasOtherText = true;
			}

			// If neither checkbox nor other field is filled, add error
			if (!hasCheckedBox && !hasOtherText) {
				validationErrors.push(`Please select at least one option or fill in the "Other" field for: ${group.name}`);
			}
		});

		return validationErrors;
	}

	// Function to highlight validation errors
	function highlightValidationErrors(errors) {
		// Clear previous highlights
		$('.validation-error').removeClass('validation-error');
		$('.validation-error-message').remove();
		
		// Add visual feedback for sections with errors
		errors.forEach(error => {
			console.log(error);
			
			// Add a subtle highlight to the form to indicate there are validation errors
			$('form').addClass('has-validation-errors');
		});
		
		// Add CSS for validation errors if not already present
		if (!$('#validation-error-styles').length) {
			$('head').append(`
				<style id="validation-error-styles">
					.has-validation-errors {
						border: 2px solid #ff6b6b;
						border-radius: 5px;
						padding: 10px;
						margin: 10px 0;
					}
					.validation-error-message {
						background-color: #ffe6e6;
						border: 1px solid #ff6b6b;
						color: #d63031;
						padding: 10px;
						margin: 10px 0;
						border-radius: 5px;
					}
				</style>
			`);
		}
	}

	// Function to clear validation highlights when user starts filling the form
	function clearValidationErrors() {
		$('form').removeClass('has-validation-errors');
		$('.validation-error-message').remove();
	}

	// Add event listeners to clear validation errors when user interacts with form
	$(document).on('change', 'input[type="checkbox"], textarea', function() {
		clearValidationErrors();
	});

	// bind events here
	$('.submit-btn').on('click', function (e) {
		// Prevent the default form submission
		e.preventDefault();

		// Validate form sections
		const validationErrors = validateFormSections();
		
		if (validationErrors.length > 0) {
			// Show validation errors
			highlightValidationErrors(validationErrors);
			frappe.msgprint({
				title: __('Validation Error'),
				indicator: 'red',
				message: __('Please complete all required sections:<br><br>') + validationErrors.join('<br>')
			});
			return;
		}

		// set custom_status to 'Documentation received'
		frappe.web_form.doc.custom_status = 'Documentation received';

		frappe.call('swissmedhealth.swissmedhealth.web_form.patient_longevity_form_2.patient_longevity_form_2.save_longevity_history', { doc: frappe.web_form.doc }).then(() => {
			let params = new URLSearchParams(window.location.search);
			let email_id = params.get('email_id');
			window.location.href = '../lead-step-4/new?email_id=' + encodeURIComponent(email_id);
		}).catch((err) => {
			frappe.msgprint({
				title: __('Error'),
				indicator: 'red',
				message: __('An error occurred while submitting your details. Please try again later.')
			});
		});
	});

})