import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import _ from "lodash";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/esm/Button";
import { AgGridReact } from "ag-grid-react";

export default function AmzListing() {
  const [data, setData] = useState([]);
  const inputFile = useRef(null);
  const [rowData, setRowData] = useState(data);

  const [columnDefs, setColumnDefs] = useState([]);

  // This method fetches the users from the database.
  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get(`/api/amzListings`);
        console.log(response);
        setData(response.data);
        setRowData(response.data);
        let columns = Object.keys(response.data[0])
          .filter((el) => el !== "_id")
          .map((el) => ({ field: el, sortable: true, filter: true }));
        setColumnDefs(columns);
      } catch (err) {
        console.log(err);
        toast.error(_.get(err, "response.data.message") || "an error occurred");
      }
    }
    getUsers();
    return;
  }, []);

  const generateListings = (file) => {
    console.log("generateListings", file);
    let reader = new FileReader();
    reader.onload = (function (reader) {
      return function () {
        console.log(reader);
        let data = reader.result.split(/\r?\n/);
        let lines = [];
        lines = data.map((d) => d.split("\n"));
        lines = lines.map((line) => line[0].split("\t"));
        const [header, ...rows] = lines;
        let finalArr = [];
        for (var vals = 0; vals < rows.length; vals++) {
          let row = rows[vals];
          if (row.length > 1) {
            let tableObj = {};
            for (let key = 0; key < header.length; key++) {
              tableObj[header[key]] = row[key];
            }
            finalArr.push(tableObj);
          }
        }
        console.log(finalArr);
        axios
          .post(`/api/amzListings`, finalArr)
          .then((resp) => console.log(resp))
          .catch((err) => console.log(err));
      };
    })(reader);
    reader.readAsText(file);
    // axios.post(`/api/amzListings`,{})
  };

  return (
    <Container>
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={(e) => generateListings(e.target.files[0])}
      />
      <Button className="float-end" onClick={() => inputFile.current.click()}>
        Generate
      </Button>
      <h3>Amazon Listing </h3>
      <hr />
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          detailRowAutoHeight={true}
          domLayout={"autoHeight"}
        ></AgGridReact>
      </div>
    </Container>
  );
}
