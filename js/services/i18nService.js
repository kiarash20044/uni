// js/services/i18nService.js

export class I18nService {
    constructor(appState) {
        this.appState = appState;
        this.translations = {
            en: {
                // Navigation & General
                dashboard: 'Dashboard',
                courses: 'Courses',
                grades: 'Grades',
                schedule: 'Schedule',
                tasks: 'Tasks',
                resources: 'Resources',
                settings: 'Settings',
                logout: 'Logout',
                welcome_back: 'Welcome Back',
                
                // Home Page
                current_gpa: 'Current GPA',
                completed_credits: 'Completed Credits',
                semesterProgress: 'Semester Progress (Weeks)',
                upcoming_deadlines: 'Upcoming Deadlines',
                recent_grades: 'Recent Grades',
                
                // Tasks Page (Kanban)
                todo: 'To Do',
                inProgress: 'In Progress',
                done: 'Done',
                addTask: 'Add a task',

                // Theme Switcher
                themeSettings: 'Theme Settings',
                accentColor: 'Accent Color',
                theme_cyan: 'Cyan (Default)',
                theme_purple: 'Purple',
                theme_green: 'Green',
                theme_orange: 'Orange',
                
                // Backup & Restore
                backupRestore: 'Data Backup & Restore',
                backupDescription: 'Create snapshots of your app data. You can restore your settings and tasks from a backup at any time.',
                createBackup: 'Create New Backup',
                noBackups: 'No backups found.',
                backupFrom: 'Backup from',
                restore: 'Restore',
                restoreConfirm: 'Are you sure you want to restore this backup? Your current data will be overwritten.',
                restoreSuccess: 'Data restored successfully! The application will now reload.',

                // Schedule (Timeline)
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

                // PDF Export
                exportPdf: 'Export PDF',

                // Guided Tour
                tour_step1_title: 'Main Navigation',
                tour_step1_content: 'Use this sidebar to navigate between different sections of your dashboard.',
                tour_step2_title: 'Content Area',
                tour_step2_content: 'This is where the main content for each page will be displayed.',
                tour_step3_title: 'Customize Theme',
                tour_step3_content: 'You can change the accent color of the application here to personalize your experience.',
                tour_step4_title: 'Manage Your Tasks',
                tour_step4_content: 'The Tasks page has a full Kanban board to organize your work. Check it out!',
            },
            fa: {
                // Navigation & General
                dashboard: 'داشبورد',
                courses: 'درس‌ها',
                grades: 'نمرات',
                schedule: 'برنامه هفتگی',
                tasks: 'کارها',
                resources: 'منابع',
                settings: 'تنظیمات',
                logout: 'خروج',
                welcome_back: 'خوش آمدید',

                // Home Page
                current_gpa: 'معدل کل',
                completed_credits: 'واحدهای گذرانده',
                semesterProgress: 'پیشرفت ترم (هفته)',
                upcoming_deadlines: 'ددلاین‌های پیش‌رو',
                recent_grades: 'نمرات اخیر',

                // Tasks Page (Kanban)
                todo: 'برای انجام',
                inProgress: 'در حال انجام',
                done: 'انجام شده',
                addTask: 'افزودن کار جدید',

                // Theme Switcher
                themeSettings: 'تنظیمات پوسته',
                accentColor: 'رنگ اصلی',
                theme_cyan: 'فیروزه‌ای (پیش‌فرض)',
                theme_purple: 'بنفش',
                theme_green: 'سبز',
                theme_orange: 'نارنجی',

                // Backup & Restore
                backupRestore: 'پشتیبان‌گیری و بازیابی اطلاعات',
                backupDescription: 'از اطلاعات برنامه خود (مانند کارها و تنظیمات) نسخه پشتیبان تهیه کنید. شما می‌توانید در هر زمان اطلاعات خود را از یک نسخه پشتیبان بازیابی کنید.',
                createBackup: 'ایجاد نسخه پشتیبان جدید',
                noBackups: 'هیچ نسخه پشتیبانی یافت نشد.',
                backupFrom: 'پشتیبان از تاریخ',
                restore: 'بازیابی',
                restoreConfirm: 'آیا از بازیابی این نسخه پشتیبان مطمئن هستید؟ اطلاعات فعلی شما بازنویسی خواهد شد.',
                restoreSuccess: 'اطلاعات با موفقیت بازیابی شد! برنامه اکنون مجدداً بارگیری می‌شود.',
                
                // Schedule (Timeline)
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

                // PDF Export
                exportPdf: 'خروجی PDF',

                // Guided Tour
                tour_step1_title: 'منوی اصلی',
                tour_step1_content: 'از این منو برای جابجایی بین بخش‌های مختلف داشبورد خود استفاده کنید.',
                tour_step2_title: 'محتوای صفحه',
                tour_step2_content: 'محتوای اصلی هر صفحه در این قسمت نمایش داده می‌شود.',
                tour_step3_title: 'شخصی‌سازی پوسته',
                tour_step3_content: 'می‌توانید رنگ اصلی برنامه را از اینجا تغییر دهید تا محیط کاربری خود را شخصی‌سازی کنید.',
                tour_step4_title: 'مدیریت کارها',
                tour_step4_content: 'صفحه کارها یک بورد کانبان کامل برای سازماندهی فعالیت‌های شما دارد. حتما آن را ببینید!',
            }
        };
    }

    translate(key) {
        const lang = this.appState.get('language') || 'fa';
        return this.translations[lang][key] || key;
    }
}