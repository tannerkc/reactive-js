import Reactive from 'reactive-js'

export default (props) => {
  const { params } = props;
  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {params.userid}</p>
    </div>
  );
}