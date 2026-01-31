(function() {
    'use strict';

    console.log('Grade-based options filter script initializing...');

    // Configuration
    const GRADE_FIELD_ID = 'tfa_898';
    const SUMMER_LOCATION_FIELD_ID = 'tfa_5266';
    const PAFSS_PROGRAM_FIELD_ID = 'tfa_4997';
    const PAFSS_PROGRAM_GROUP_ID = 'tfa_2591';

    // Grade groupings
    const MIDDLE_SCHOOL_GRADES = ['tfa_904', 'tfa_905', 'tfa_906', 'tfa_907']; // 6, 7, 8, 9 (allowable in summer only)
    const ELEMENTARY_GRADES = ['tfa_929', 'tfa_930', 'tfa_931', 'tfa_899', 'tfa_900', 'tfa_901', 'tfa_902', 'tfa_903']; // T-K through 5
    const HIGH_SCHOOL_GRADES = ['tfa_907', 'tfa_908', 'tfa_909', 'tfa_910']; // 9, 10, 11, 12,
    const PAFSS_SFP_GRADES = ['tfa_901', 'tfa_902', 'tfa_903', 'tfa_904']; // 3, 4, 5, 6,
    const PAFSS_YAP_POST_HS_GRADE = ['tfa_1098']; // Post HS.

    // Location option IDs
    const JAMES_LICK = 'tfa_5269';
    const BVHM = 'tfa_5268';
    const CESAR_CHAVEZ = 'tfa_5267';
  // Cleared out for this cycle
    // const LONGFELLOW = 'tfa_5270';

    // PAFSS Programs option IDs
    const PAFSS_CMCA = 'tfa_4998';
    const PAFSS_YIC = 'tfa_4999';
    const PAFSS_YAPC = 'tfa_5000';
    const PAFSS_SFP = 'tfa_5001';
    const PAFSS_YAP = 'tfa_5002';

    // Store original options
    let originalLocationOptions = [];
    let originalPAFSSProgramOptions = [];

    function initializeScript() {
        const gradeField = document.getElementById(GRADE_FIELD_ID);
        const locationField = document.getElementById(SUMMER_LOCATION_FIELD_ID);
        const pafssProgramField = document.getElementById(PAFSS_PROGRAM_FIELD_ID);

        if (!gradeField) {
            console.error('Grade field not found:', GRADE_FIELD_ID);
            return;
        }

        if (!locationField) {
            console.error('Location field not found:', SUMMER_LOCATION_FIELD_ID);
            return;
        }

        if (!pafssProgramField) {
            console.error('PAFSS Program field not found:', PAFSS_PROGRAM_FIELD_ID);
            return;
        }

        console.log('Fields found successfully');

        // Store original location options
        storeOriginalOptions(locationField);
        storeOriginalOptions(pafssProgramField);

        // Apply filter on page load if grade is already selected
        const currentGrade = gradeField.value;
        if (currentGrade) {
            console.log('Grade already selected on load:', currentGrade);
            filterLocationOptions(currentGrade, locationField);
            filterPafssProgramOptions(currentGrade, pafssProgramField);
        }

        // Listen for grade changes
        gradeField.addEventListener('change', function() {
            const selectedGrade = this.value;
            console.log('Grade changed to:', selectedGrade);
            filterLocationOptions(selectedGrade, locationField);
            filterPafssProgramOptions(selectedGrade, pafssProgramField);
        });

        console.log('Grade-based options filter script initialized successfully');
    }

    function storeOriginalOptions(optionsField) {
        if (!optionsField) {
            console.warn('storeOriginalOptions() - Options field is null or undefined');
            return;
        }
        switch (optionsField.id) {
            case SUMMER_LOCATION_FIELD_ID:
                originalLocationOptions = Array.from(optionsField.options).map(option => ({
                    value: option.value,
                    id: option.id,
                    text: option.text,
                    className: option.className
                }));
                console.log('storeOriginalOptions() - Stored original location options:', originalLocationOptions.length);
                break;
            case PAFSS_PROGRAM_FIELD_ID:
                originalPAFSSProgramOptions = Array.from(optionsField.options).map(option => ({
                    value: option.value,
                    id: option.id,
                    text: option.text,
                    className: option.className
                }));
                console.log('storeOriginalOptions() - Stored original PAFSS program options:', originalPAFSSProgramOptions.length);
                break;
        default:
            console.log('storeOriginalOptions() - Options field not found:', optionsField.id);
        }
    }

    function filterLocationOptions(selectedGrade, locationField) {
        try {
            // Reset location field value
            locationField.value = '';

            // Clear ALL options including placeholder
            while (locationField.options.length > 0) {
                locationField.remove(0);
            }

            let optionsToShow = [];

            if (MIDDLE_SCHOOL_GRADES.includes(selectedGrade)) {
                // Show only James Lick for grades 6-9
                optionsToShow = [JAMES_LICK];
                console.log('filterLocationOptions() - Showing James Lick only (grades 6-9)');
            } else if (ELEMENTARY_GRADES.includes(selectedGrade)) {
              // Show BVHM, Cesar Chavez for T-K through 5
                optionsToShow = [BVHM, CESAR_CHAVEZ];
                // Show BVHM, Cesar Chavez, and Longfellow for T-K through 5
                // optionsToShow = [BVHM, CESAR_CHAVEZ, LONGFELLOW];
                console.log('filterLocationOptions() - Showing elementary locations (T-K through 5)');
            } else {
                // No grade selected or other grade - show all options
                optionsToShow = [JAMES_LICK, BVHM, CESAR_CHAVEZ];
                // // No grade selected or other grade - show all options
                // optionsToShow = [JAMES_LICK, BVHM, CESAR_CHAVEZ, LONGFELLOW];
                console.log('filterLocationOptions() - No valid grade selected - showing all options');
            }

            // Add options back (including placeholder)
            originalLocationOptions.forEach(optionData => {
                if (optionData.value === '' || optionsToShow.includes(optionData.id)) {
                    const option = new Option(optionData.text, optionData.value);
                    option.id = optionData.id;
                    option.className = optionData.className;
                    locationField.add(option);
                }
            });

            console.log('filterLocationOptions() - Location options filtered. Available options:', optionsToShow.length);

        } catch (error) {
            console.error('filterLocationOptions() - Error filtering location options:', error);
        }
    }

    function filterPafssProgramOptions(selectedGrade, pafssProgramField) {
        try {
            // Reset location field value
            pafssProgramField.value = '';

            // Clear ALL options including placeholder
            while (pafssProgramField.options.length > 0) {
                pafssProgramField.remove(0);
            }

            let optionsToShow = [];

            if (PAFSS_SFP_GRADES.includes(selectedGrade)) {
                // Show only SFP for grades 3-6
                optionsToShow = [PAFSS_SFP];
                console.log('filterPafssProgramOptions() - Showing PAFSS SFP only (grades 3-6)');
            } else if (HIGH_SCHOOL_GRADES.includes(selectedGrade)) {
              // Show LifeSkills, CMCA/YIC, YPAC, YAP for 9 through 12
                optionsToShow = [PAFSS_CMCA, PAFSS_YIC, PAFSS_YAP, PAFSS_YAPC];
                console.log('filterPafssProgramOptions() - Showing high school PAFSS programs (9 through 12)');
            } else if (PAFSS_YAP_POST_HS_GRADE.includes(selectedGrade)) {
                // Show YAP for Post HS
                optionsToShow = [PAFSS_YAP];
                console.log('filterPafssProgramOptions() - Showing Post HS PAFSS Program');
            } else {
                // No grade selected or other grade - Default to all
                optionsToShow = [PAFSS_CMCA, PAFSS_YIC, PAFSS_YAP, PAFSS_YAPC, PAFSS_SFP];
                console.log('filterPafssProgramOptions() - No valid grade selected - showing all options. Form conditionals will hide PAFSS');
            }

            // Add options back (including placeholder)
            originalPAFSSProgramOptions.forEach(optionData => {
                if (optionData.value === '' || optionsToShow.includes(optionData.id)) {
                    const option = new Option(optionData.text, optionData.value);
                    option.id = optionData.id;
                    option.className = optionData.className;
                    pafssProgramField.add(option);
                }
            });
            console.log('filterPafssProgramOptions() - PAFSS Programs options filtered. Available options:', optionsToShow.length);

        } catch (error) {
            console.error('filterPafssProgramOptions() - Error filtering PAFSS program options:', error);
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
        console.log('Waiting for DOMContentLoaded...');
    } else {
        // DOM already loaded
        initializeScript();
    }

})();