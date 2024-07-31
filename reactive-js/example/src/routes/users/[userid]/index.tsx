import Reactive from 'reactive-js'

// export default (props: any) => {
//   const { params } = props;

//   return (
//     <div>
//       <h1>User Profile</h1>
//       <p>User ID: {params.userid}</p>
//     </div>
//   );
// }

export default ({ userid }: { userid: string }) => {
  return (
    <div>
      <h1>User Settings</h1>
      <p>Settings for user {userid}</p>
    </div>
  );
}