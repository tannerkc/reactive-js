// ./src/routes/index.ts
import Reactive, { state } from "reactivejs" // enables jsx
import { signIn } from 'reactivejs/auth'; // an auth library that handles sessions and tokens, similar to next.js
import { useRouter, useSearchParams } from 'reactivejs/navigation' // a navigation library like next/navigation

export default () => {
    const [name, setName] = state('') // js signal / effect pattern for live reactivity

    return (
        <div>
            <h1>Welcome {name}, to ReactiveJS</h1> {/* 'name' updates automatically, without re-rendering everything. no calling it like: name(). use svelte 5 $state() pattern.  */}
            <p>This app was created using: 'create-reactive-app'</p>
            <input placeholder="Enter your name" onChange={e => setName(e.target.value)} />
        </div>
    )
}