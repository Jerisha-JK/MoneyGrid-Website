export function cn(...args) {
    // Your utility function logic here
    return args.filter(Boolean).join(' ');
  }