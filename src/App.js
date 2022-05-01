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
    // || imageUpload.name.substring(imageUpload.name.lastIndexOf('.'))!== 'jpg'
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App my">
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <div className="btn-group mb">
        <button
          className="btn btn-primary"
          onClick={uploadFile}
        > Upload Image</button>
        <button
          className="btn btn-primary"
          onClick={()=>showPics()}
        >Get</button>
      </div>
      <div className="flex-container">
        {imageUrls.map((item) => (
          <>
          <div className="card" style={{width:'14rem'}}>
              <img className="card-img-top" src={item.url} alt={'.'} />
              <div className="hr"></div>
              <div className="btn-group">
            <button 
              className="btn btn-danger"
              onClick={() => deleteImage(item.path)}
            >Delete</button>
            <a href={item.url} className="btn btn-primary" rel={'noreferrer'}   target={'_blank'}>Open</a>
              </div>
          </div>
          </>
        ))}
        </div>
    </div>
  );
}

export default App;
