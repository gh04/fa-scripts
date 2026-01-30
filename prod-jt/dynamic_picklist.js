(function() {
    'use strict';

    console.log('Grade-based location filter script initializing...');

    // Configuration
    const GRADE_FIELD_ID = 'tfa_898';
    const SUMMER_LOCATION_FIELD_ID = 'tfa_5266';

    // Grade groupings
    const MIDDLE_SCHOOL_GRADES = ['tfa_904', 'tfa_905', 'tfa_906', 'tfa_907']; // 6, 7, 8, 9
    const ELEMENTARY_GRADES = ['tfa_929', 'tfa_930', 'tfa_931', 'tfa_899', 'tfa_900', 'tfa_901', 'tfa_902', 'tfa_903']; // T-K through 5

    // Location option IDs
    const JAMES_LICK = 'tfa_5269';
    const BVHM = 'tfa_5268';
    const CESAR_CHAVEZ = 'tfa_5267';
  // Cleared out for this cycle
    // const LONGFELLOW = 'tfa_5270';

    // Store original options
    let originalLocationOptions = [];

    function initializeScript() {
        const gradeField = document.getElementById(GRADE_FIELD_ID);
        const locationField = document.getElementById(SUMMER_LOCATION_FIELD_ID);

        if (!gradeField) {
            console.error('Grade field not found:', GRADE_FIELD_ID);
            return;
        }

        if (!locationField) {
            console.error('Location field not found:', SUMMER_LOCATION_FIELD_ID);
            return;
        }

        console.log('Fields found successfully');

        // Store original location options
        storeOriginalOptions(locationField);

        // Apply filter on page load if grade is already selected
        const currentGrade = gradeField.value;
        if (currentGrade) {
            console.log('Grade already selected on load:', currentGrade);
            filterLocationOptions(currentGrade, locationField);
        }

        // Listen for grade changes
        gradeField.addEventListener('change', function() {
            const selectedGrade = this.value;
            console.log('Grade changed to:', selectedGrade);
            filterLocationOptions(selectedGrade, locationField);
        });

        console.log('Grade-based location filter script initialized successfully');
    }

    function storeOriginalOptions(locationField) {
        originalLocationOptions = Array.from(locationField.options).map(option => ({
            value: option.value,
            id: option.id,
            text: option.text,
            className: option.className
        }));
        console.log('Stored original location options:', originalLocationOptions.length);
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
                console.log('Showing James Lick only (grades 6-9)');
            } else if (ELEMENTARY_GRADES.includes(selectedGrade)) {
              // Show BVHM, Cesar Chavez for T-K through 5
                optionsToShow = [BVHM, CESAR_CHAVEZ];
                // Show BVHM, Cesar Chavez, and Longfellow for T-K through 5
                // optionsToShow = [BVHM, CESAR_CHAVEZ, LONGFELLOW];
                console.log('Showing elementary locations (T-K through 5)');
            } else {
                // No grade selected or other grade - show all options
                optionsToShow = [JAMES_LICK, BVHM, CESAR_CHAVEZ];
                // // No grade selected or other grade - show all options
                // optionsToShow = [JAMES_LICK, BVHM, CESAR_CHAVEZ, LONGFELLOW];
                console.log('No valid grade selected - showing all options');
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

            console.log('Location options filtered. Available options:', optionsToShow.length);

        } catch (error) {
            console.error('Error filtering location options:', error);
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