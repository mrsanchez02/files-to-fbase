import "./App.css";
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";

function App() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload)
      .then(() => showPics())
      .then(() => setImageUpload(null));
  };

  const showPics = async () => {
    setImageUrls([]);
    const list = await listAll(imagesListRef);
    list.items.map(async (item) => {
      const URL = await getDownloadURL(item);
      setImageUrls((prev) => [...prev, {
        url: URL,
        path: item._location.path_
      }]);
    });
  }

  const deleteImage = (path) => {
    const imageRef = ref(storage, path);
    deleteObject(imageRef)
      .then(() => {
        setImageUrls((prev) => prev.filter((item) => item !== path));
        console.log("deleted");
        showPics();
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    return () => showPics()
  }, []);

  return (
    <div className="App">
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button
        onClick={uploadFile}
      > Upload Image</button>
      <button
        onClick={showPics}
      >Get</button>
      {imageUrls.map((item) => (
        <>
          <img src={item.url} alt={'.'} />
          <button onClick={() => deleteImage(item.path)}>Delete</button>
        </>
      ))}
    </div>
  );
}

export default App;
