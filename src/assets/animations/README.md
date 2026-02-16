# Animations Folder

Store your Lottie/JSON animation files here.

## Usage

Import animations in your components:

```tsx
import animationData from '@/assets/animations/your-animation.json';
```

For Lottie animations, you can use libraries like:
- `lottie-react` - for React integration
- `lottie-web` - vanilla JavaScript

## Example with lottie-react:

```tsx
import Lottie from 'lottie-react';
import animationData from '@/assets/animations/your-animation.json';

function MyComponent() {
  return <Lottie animationData={animationData} loop={true} />;
}
```
