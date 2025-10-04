import { useTheme } from '../ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="theme-toggle-wrapper">
      <label className="theme-toggle">
        <input
          type="checkbox"
          checked={isDark}
          onChange={toggleTheme}
        />
        <span className="slider" />
        <span className="knob" />
      </label>
    </div>
  );
}
