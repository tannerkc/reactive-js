import Reactive, { state, effect } from "reactive-js"

export default () => {
    const [name, setName] = state('Visitor')
    return (
      <div>
        <h1>Welcome, {name} to the Home Page</h1>
        <p>This is the content of the home page.</p>
        <input type="text" placeholder="Tell us your name" onChange={(e:any) => setName(e.target.value)} />
      </div>
    );
}