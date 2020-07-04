import React from 'react';

const Username = props => {

  // const socket = props.socket;
  const handleChange = props.handleChange;
  const username = props.username;
  const submit = props.submit;

  return (
    <React.Fragment>
      <h1 className="mt-16 text-center text-custom-white text-2xl md:text-4xl font-extrabold">Welcome to Chatticus!</h1>
      <form className="flex flex-col items-center space-y-8"
        onSubmit={submit}
      >
        <label className="p-2 text-xl md:text-2xl text-custom-white font-medium"
          htmlFor="username"
        >
          Please create a username for this session
        </label>
        <input className="p-2 text-lg md:text-xl rounded-lg focus:outline-none focus:shadow-outline"
          name="username"
          type="text"
          required
          onChange={handleChange}
          value={username}
        />
        <button className="bg-custom-gold p-2 text-custom-blue text-xl md:text-2xl font-medium rounded-lg focus:outline-none focus:shadow-outline"
          type="submit"
        >Let's Go!</button>
      </form>
    </React.Fragment>
  );
};

export default Username;

// <h1 className="mt-16 text-center text-custom-white text-2xl md:text-4xl font-extrabold">Welcome to Chatticus!</h1>
// <form className="flex flex-col items-center space-y-8"
//   onSubmit={usernameSubmit}
// >
//   <label className="p-2 text-xl md:text-2xl text-custom-white font-medium"
//     htmlFor="username"
//   >
//     Please create a username for this session
//   </label>
//   <input className="p-2 text-lg md:text-xl rounded-lg focus:outline-none focus:shadow-outline"
//     name="username"
//     type="text"
//     required
//     onChange={handleChange}
//     value={values.username}
//   />
//   <button className="bg-custom-gold p-2 text-custom-blue text-xl md:text-2xl font-medium rounded-lg focus:outline-none focus:shadow-outline"
//     type="submit"
//   >
//     Let's Go!
//   </button>
// </form>