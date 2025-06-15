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
                todo: 'To Do',
                inProgress: 'In Progress',
                done: 'Done',
                addTask: 'Add a task',
                themeSettings: 'Theme Settings',
                accentColor: 'Accent Color',
                theme_cyan: 'Cyan (Default)',
                theme_purple: 'Purple',
                theme_green: 'Green',
                theme_orange: 'Orange',
                // ✨ NEW Translations
                backupRestore: 'Data Backup & Restore',
                backupDescription: 'Create snapshots of your app data. You can restore your settings and tasks from a backup at any time.',
                createBackup: 'Create New Backup',
                noBackups: 'No backups found.',
                backupFrom: 'Backup from',
                restore: 'Restore',
                restoreConfirm: 'Are you sure you want to restore this backup? Your current data will be overwritten.',
                restoreSuccess: 'Data restored successfully! The application will now reload.',
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
                todo: 'برای انجام',
                inProgress: 'در حال انجام',
                done: 'انجام شده',
                addTask: 'افزودن کار جدید',
                themeSettings: 'تنظیمات پوسته',
                accentColor: 'رنگ اصلی',
                theme_cyan: 'فیروزه‌ای (پیش‌فرض)',
                theme_purple: 'بنفش',
                theme_green: 'سبز',
                theme_orange: 'نارنجی',
                // ✨ NEW Translations
                backupRestore: 'پشتیبان‌گیری و بازیابی اطلاعات',
                backupDescription: 'از اطلاعات برنامه خود (مانند کارها و تنظیمات) نسخه پشتیبان تهیه کنید. شما می‌توانید در هر زمان اطلاعات خود را از یک نسخه پشتیبان بازیابی کنید.',
                createBackup: 'ایجاد نسخه پشتیبان جدید',
                noBackups: 'هیچ نسخه پشتیبانی یافت نشد.',
                backupFrom: 'پشتیبان از تاریخ',
                restore: 'بازیابی',
                restoreConfirm: 'آیا از بازیابی این نسخه پشتیبان مطمئن هستید؟ اطلاعات فعلی شما بازنویسی خواهد شد.',
                restoreSuccess: 'اطلاعات با موفقیت بازیابی شد! برنامه اکنون مجدداً بارگیری می‌شود.',
            }
        };
    }

    translate(key) {
        const lang = this.appState.get('language') || 'fa';
        return this.translations[lang][key] || key;
    }
}