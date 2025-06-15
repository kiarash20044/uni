// js/services/guideService.js

import { StorageService } from './storageService.js';
import { I18nService } from './i18nService.js';

const storage = new StorageService();
const TOUR_COMPLETED_KEY = 'tour_completed';

/**
 * Manages the guided tour for first-time users.
 */
export class GuideService {
    constructor(appState, i18n) {
        this.appState = appState;
        this.i18n = i18n;
        this.tourInstance = null;
    }

    /**
     * Defines the steps for the guided tour.
     * @returns {Array} An array of tour step objects.
     */
    getTourSteps() {
        return [
            {
                element: '#sidebar-nav',
                title: this.i18n.translate('tour_step1_title'),
                content: this.i18n.translate('tour_step1_content'),
                placement: 'right',
            },
            {
                element: '#page-content',
                title: this.i18n.translate('tour_step2_title'),
                content: this.i18n.translate('tour_step2_content'),
                placement: 'top',
            },
            {
                element: '#theme-switcher',
                title: this.i18n.translate('tour_step3_title'),
                content: this.i18n.translate('tour_step3_content'),
                placement: 'bottom',
            },
            {
                element: '#tasks-link',
                title: this.i18n.translate('tour_step4_title'),
                content: this.i18n.translate('tour_step4_content'),
                placement: 'right',
            }
        ];
    }

    /**
     * Starts the tour if it hasn't been completed before.
     */
    startTourIfNeeded() {
        if (storage.get(TOUR_COMPLETED_KEY)) {
            return;
        }

        const steps = this.getTourSteps();
        // Fallback: Use alert for each step instead of tippy.guided
        let currentStep = 0;
        const showStep = () => {
            if (currentStep >= steps.length) {
                storage.set(TOUR_COMPLETED_KEY, true);
                return;
            }
            const step = steps[currentStep];
            alert(`${step.title}\n\n${step.content}`);
            currentStep++;
            showStep();
        };
        showStep();
    }
}