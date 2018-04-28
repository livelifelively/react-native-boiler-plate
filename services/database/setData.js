import firebase from 'react-native-firebase';

export default function setData(action) {
  const ref = action.meta.node;

  if (__DEV__) {
    console.log(`Dispatching get at ${ref}`);
  }

  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(ref)
      .set(action.payload)
      .then(() => {
        resolve({
          payload: true,
        });
      })
      .catch((error) => {
        reject(new Error(error));
      });
  });
}
