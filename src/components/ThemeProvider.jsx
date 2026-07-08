"use client";

// We must declare "use client" because theme switching relies on React state and context.
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }) {
  return (
    // 'attribute="class"' tells next-themes to apply the class="dark" attribute to the <html> tag,
    // which activates the .dark selector variables we defined in globals.css.
    // 'defaultTheme="system"' detects system OS preferences on first load.
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
