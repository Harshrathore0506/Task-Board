# TaskBoard - Collaborative Task Management Application

A beautiful, fully-featured Kanban-style task management application built with React, TypeScript, and Tailwind CSS. Organize your projects, collaborate with your team, and stay productive with an intuitive drag-and-drop interface.

![TaskBoard Screenshot](https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## ✨ Features

### 🎯 Core Functionality
- **Multi-Board Management**: Create, edit, and delete project boards
- **Kanban Columns**: Customizable columns (To Do, In Progress, Done, etc.)
- **Rich Task Management**: Create tasks with titles, descriptions, assignees, priorities, and due dates
- **Drag & Drop**: Native drag-and-drop for reordering tasks and moving between columns
- **Search & Filter**: Advanced filtering by priority, due date, and text search
- **Offline Support**: Full functionality using localStorage persistence

### 🎨 Design & User Experience
- **Dark Mode**: Toggle between light and dark themes with system preference detection
- **Responsive Design**: Beautiful layouts that work on mobile, tablet, and desktop
- **Smooth Animations**: Subtle animations and micro-interactions throughout
- **Empty States**: Helpful guidance when boards or columns are empty
- **Loading States**: Smooth loading animations for better user feedback

### 🔧 Technical Features
- **TypeScript**: Full type safety and better development experience
- **Context API**: Global state management for boards, tasks, and theme
- **Custom Hooks**: Reusable hooks for localStorage and system theme detection
- **Modular Architecture**: Clean, maintainable code structure
- **Accessibility**: ARIA labels and keyboard navigation support

## 🚀 Tech Stack

- **React 18** - Modern React with Hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icons
- **Vite** - Fast build tool and dev server
- **Context API** - State management
- **localStorage** - Client-side data persistence

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📱 Usage Guide

### Getting Started
1. **Create Your First Board**: Click "Create Board" and add a title and description
2. **Add Columns**: Use "Add Column" to create workflow stages (e.g., "To Do", "In Progress", "Done")
3. **Create Tasks**: Click "Add Task" in any column to create new tasks
4. **Organize Tasks**: Drag and drop tasks between columns and reorder within columns

### Task Management
- **Priority Levels**: Assign high (red), medium (yellow), or low (green) priority
- **Due Dates**: Set due dates to track deadlines
- **Assignees**: Assign tasks to team members
- **Search**: Use the search bar to find specific tasks
- **Filter**: Filter tasks by priority or due date

### Advanced Features
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Works seamlessly on all device sizes
- **Offline**: All data is stored locally and works without internet
- **Drag & Drop**: Intuitive task organization

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BoardCard.tsx   # Individual board card
│   ├── BoardForm.tsx   # Board creation/editing form
│   ├── Column.tsx      # Kanban column component
│   ├── ColumnForm.tsx  # Column creation/editing form
│   ├── EmptyState.tsx  # Empty state components
│   ├── LoadingSpinner.tsx # Loading animations
│   ├── SearchFilter.tsx # Search and filter controls
│   ├── TaskCard.tsx    # Individual task card
│   ├── TaskForm.tsx    # Task creation/editing form
│   └── ThemeToggle.tsx # Dark mode toggle
├── contexts/           # React Context providers
│   ├── BoardContext.tsx # Board and task state management
│   └── ThemeContext.tsx # Theme state management
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts # localStorage persistence
├── pages/              # Main page components
│   ├── BoardDetail.tsx # Board detail view
│   └── BoardList.tsx   # Board list view
├── types/              # TypeScript type definitions
│   └── index.ts        # All application types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Actions and highlights
- **Secondary**: Purple (#8B5CF6) - Accents and gradients
- **Success**: Green (#10B981) - Low priority and success states
- **Warning**: Yellow (#F59E0B) - Medium priority and warnings
- **Error**: Red (#EF4444) - High priority and errors
- **Gray Scale**: Comprehensive gray scale for text and backgrounds

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Readable with proper contrast
- **Labels**: Medium weight for form elements

### Spacing
- **8px Grid System**: Consistent spacing throughout
- **Responsive**: Adapts to different screen sizes

## 🌟 Key Features Explained

### Drag & Drop
Native HTML5 drag and drop implementation with visual feedback and smooth animations.

### Search & Filter
- **Text Search**: Search across task titles and descriptions
- **Priority Filter**: Filter by high, medium, or low priority
- **Due Date Filter**: Filter by overdue, today, this week, or this month

### Data Persistence
All data is automatically saved to localStorage, ensuring your work is never lost.

### Responsive Design
- **Mobile**: Stacked layout with touch-friendly interactions
- **Tablet**: Balanced layout with good use of space
- **Desktop**: Full-width layout with optimal task visibility

## 🔮 Future Enhancements

- **Real-time Collaboration**: Multi-user support with WebSocket
- **File Attachments**: Add files to tasks
- **Task Dependencies**: Link related tasks
- **Time Tracking**: Track time spent on tasks
- **Export/Import**: Backup and restore boards
- **Advanced Analytics**: Project insights and reporting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🚀 Deployment

This application can be deployed to any static hosting service:

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure the build command: `npm run build`
4. Set the publish directory: `dist`

### Vercel
1. Connect your repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with default settings

### GitHub Pages
1. Build the project: `npm run build`
2. Deploy the `dist` folder to GitHub Pages
3. Configure the base URL in `vite.config.ts` if needed

---

Made with ❤️ using React, TypeScript, and Tailwind CSS