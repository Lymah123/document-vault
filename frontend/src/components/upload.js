// import React, { useState } from "react";
// import { uploadfile, fetchFiles} from "./api";

// const Upload = () => {
//   const [file, setFile] = useState(null);
//   const [files, setFiles] = useState([]);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleFileUpload = async () => {
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       await uploadFile(formData);
//       alert("File uploaded successfully");
//       loadFiles();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (cd
//     <div>
//       <input type="file" onChange={handlefileChange} />
//       <button onClick={handleUpload}>Uplaod</button>
//       <ul>
//         {files.map((file, index) => (
//           <li key={index}>
//             <a href={file.url} target="_blank" rel="noopener noreferrer">
//               {file.key}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Upload;

