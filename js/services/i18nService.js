// js/services/i18nService.js

export class I18nService {
    constructor(appState) {
        this.appState = appState;
        this.translations = {
            en: {
                dashboard: 'Dashboard',
                courses: 'Courses',
                grades: 'Grades',
                schedule: 'Schedule',
                tasks: 'Tasks',
                resources: 'Resources',
                settings: 'Settings',
                logout: 'Logout',
                welcome_back: 'Welcome Back',
                current_gpa: 'Current GPA',
                completed_credits: 'Completed Credits',
                upcoming_deadlines: 'Upcoming Deadlines',
                recent_grades: 'Recent Grades',
                // ✨ NEW Translations
                todo: 'To Do',
                inProgress: 'In Progress',
                done: 'Done',
                addTask: 'Add a task'
            },
            fa: {
                dashboard: 'داشبورد',
                courses: 'درس‌ها',
                grades: 'نمرات',
                schedule: 'برنامه هفتگی',
                tasks: 'کارها',
                resources: 'منابع',
                settings: 'تنظیمات',
                logout: 'خروج',
                welcome_back: 'خوش آمدید',
                current_gpa: 'معدل کل',
                completed_credits: 'واحدهای گذرانده',
                upcoming_deadlines: 'ددلاین‌های پیش‌رو',
                recent_grades: 'نمرات اخیر',
                // ✨ NEW Translations
                todo: 'برای انجام',
                inProgress: 'در حال انجام',
                done: 'انجام شده',
                addTask: 'افزودن کار جدید'
            }
        };
    }

    translate(key) {
        const lang = this.appState.get('language') || 'fa';
        return this.translations[lang][key] || key;
    }
}