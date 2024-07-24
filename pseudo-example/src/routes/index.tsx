// ./src/routes/index.ts
import Reactive from "reactivejs" // enables jsx
import { signIn } from 'reactivejs/auth'; // an auth library that handles sessions and tokens, similar to next.js
import { useRouter, useSearchParams } from 'reactivejs/navigation' // a navigation library like next/navigation

export default () => (
    <div>
        <h1>Welcome to ReactiveJS</h1>
        <p>This app was created using: 'create-reactive-app'</p>
    </div>
)