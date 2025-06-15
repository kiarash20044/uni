// js/services/i18nService.js

export class I18nService {
    constructor(appState) {
        this.appState = appState;
        this.translations = {
            en: {
                // ... (previous keys)
                semesterProgress: 'Semester Progress (Weeks)',
                upcoming_deadlines: 'Upcoming Deadlines',
                // ✨ NEW Translations
                semesterTimeline: 'Semester Timeline',
                addEvent: 'Add New Event',
                eventTitle: 'Event Title',
                eventTitlePlaceholder: 'e.g., Physics Midterm',
                eventDate: 'Date',
                eventType: 'Type',
                eventTypeExam: 'Exam',
                eventTypeDeadline: 'Deadline',
                eventTypeHoliday: 'Holiday',
                eventTypeEvent: 'General Event',
                noEvents: 'No events on your timeline yet. Add one to get started!',
                // ... (other existing keys)
            },
            fa: {
                // ... (previous keys)
                semesterProgress: 'پیشرفت ترم (هفته)',
                upcoming_deadlines: 'ددلاین‌های پیش‌رو',
                // ✨ NEW Translations
                semesterTimeline: 'خط زمانی ترم',
                addEvent: 'افزودن رویداد جدید',
                eventTitle: 'عنوان رویداد',
                eventTitlePlaceholder: 'مثلا: امتحان میان‌ترم فیزیک',
                eventDate: 'تاریخ',
                eventType: 'نوع',
                eventTypeExam: 'امتحان',
                eventTypeDeadline: 'ددلاین',
                eventTypeHoliday: 'تعطیلات',
                eventTypeEvent: 'رویداد عمومی',
                noEvents: 'هنوز رویدادی در خط زمانی شما ثبت نشده است. برای شروع یکی اضافه کنید!',
                // ... (other existing keys)
            }
        };
        // A little trick to avoid re-listing all keys
        this.full_translations_en = {...this.getEnTranslations(), ...this.translations.en};
        this.full_translations_fa = {...this.getFaTranslations(), ...this.translations.fa};
        this.translations.en = this.full_translations_en;
        this.translations.fa = this.full_translations_fa;
    }

    translate(key) {
        const lang = this.appState.get('language') || 'fa';
        return this.translations[lang][key] || key;
    }
    
    // NOTE: In a real app, these would be in separate JSON files, not duplicated here.
    // This is just to provide the full file content as requested.
    getEnTranslations() {
        return {
            dashboard: 'Dashboard', courses: 'Courses', grades: 'Grades', schedule: 'Schedule', tasks: 'Tasks', resources: 'Resources', settings: 'Settings', logout: 'Logout', welcome_back: 'Welcome Back', current_gpa: 'Current GPA', completed_credits: 'Completed Credits', recent_grades: 'Recent Grades', todo: 'To Do', inProgress: 'In Progress', done: 'Done', addTask: 'Add a task', themeSettings: 'Theme Settings', accentColor: 'Accent Color', theme_cyan: 'Cyan (Default)', theme_purple: 'Purple', theme_green: 'Green', theme_orange: 'Orange', backupRestore: 'Data Backup & Restore', backupDescription: 'Create snapshots of your app data. You can restore your settings and tasks from a backup at any time.', createBackup: 'Create New Backup', noBackups: 'No backups found.', backupFrom: 'Backup from', restore: 'Restore', restoreConfirm: 'Are you sure you want to restore this backup? Your current data will be overwritten.', restoreSuccess: 'Data restored successfully! The application will now reload.'
        }
    }
    getFaTranslations() {
        return {
            dashboard: 'داشبورد', courses: 'درس‌ها', grades: 'نمرات', schedule: 'برنامه هفتگی', tasks: 'کارها', resources: 'منابع', settings: 'تنظیمات', logout: 'خروج', welcome_back: 'خوش آمدید', current_gpa: 'معدل کل', completed_credits: 'واحدهای گذرانده', recent_grades: 'نمرات اخیر', todo: 'برای انجام', inProgress: 'در حال انجام', done: 'انجام شده', addTask: 'افزودن کار جدید', themeSettings: 'تنظیمات پوسته', accentColor: 'رنگ اصلی', theme_cyan: 'فیروزه‌ای (پیش‌فرض)', theme_purple: 'بنفش', theme_green: 'سبز', theme_orange: 'نارنجی', backupRestore: 'پشتیبان‌گیری و بازیابی اطلاعات', backupDescription: 'از اطلاعات برنامه خود (مانند کارها و تنظیمات) نسخه پشتیبان تهیه کنید. شما می‌توانید در هر زمان اطلاعات خود را از یک نسخه پشتیبان بازیابی کنید.', createBackup: 'ایجاد نسخه پشتیبان جدید', noBackups: 'هیچ نسخه پشتیبانی یافت نشد.', backupFrom: 'پشتیبان از تاریخ', restore: 'بازیابی', restoreConfirm: 'آیا از بازیابی این نسخه پشتیبان مطمئن هستید؟ اطلاعات فعلی شما بازنویسی خواهد شد.', restoreSuccess: 'اطلاعات با موفقیت بازیابی شد! برنامه اکنون مجدداً بارگیری می‌شود.'
        }
    }
}