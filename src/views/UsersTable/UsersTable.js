import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import card from "../../assets/img/card.jpg";
//Table
import tableIcons from "../../assets/table";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";

import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
const useStyles = makeStyles(styles);
var QRCode = require("qrcode.react");

export default function UserTable() {
  const classes = useStyles();
  const [timeUpdate, setTimeUpdate] = useState("");
  const [data, setData] = useState([]);
  const [dataAdmin, setDataAdmin] = useState([]);
  const [qrValue, setQrValue] = useState("");
  const [id, setId] = useState("");

  React.useEffect(() => {
    fetch(
      "https://cors-anywhere.herokuapp.com/http://ec2-35-158-214-30.eu-central-1.compute.amazonaws.com:3001/profile/profileData",
      {
        method: "GET",
      }
    )
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Error creating User");
        }
        return res.json();
      })
      .then((resData) => {
        var array = [];
        resData.data.forEach((element) => {
          var email = element.email;
          var id = element._id;
          var password = "**********";
          var profile = "http://localhost:3000/profile-page/" + id;
          var obj = {
            email,
            id,
            password,
            profile,
          };
          array.push(obj);
        });
        console.log(array);
        setData(array);
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(
      "https://cors-anywhere.herokuapp.com/http://ec2-35-158-214-30.eu-central-1.compute.amazonaws.com:3001/admin/get",
      {
        method: "GET",
      }
    )
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Error creating User");
        }
        return res.json();
      })
      .then((resData) => {
        var array = [];
        resData.data.forEach((element) => {
          var email = element.email;
          var id = element._id;
          var password = "**********";
          var obj = {
            email,
            id,
            password,
          };
          array.push(obj);
        });
        var currentdate = new Date();
        var time =
          currentdate.getHours() +
          ":" +
          currentdate.getMinutes() +
          ":" +
          currentdate.getSeconds();
        setTimeUpdate(time);
        setDataAdmin(array);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteUser = (id) => {
    fetch(
      "https://cors-anywhere.herokuapp.com/http://ec2-35-158-214-30.eu-central-1.compute.amazonaws.com:3001/profile/deleteUser",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      }
    )
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          throw new Error("Error creating User");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteAdmin = (id) => {
    fetch(
      "https://cors-anywhere.herokuapp.com/http://ec2-35-158-214-30.eu-central-1.compute.amazonaws.com:3001/admin/deleteAdmin",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      }
    )
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          throw new Error("Error creating User");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUser = (data) => {
    console.log(data.password);
    fetch(
      "https://cors-anywhere.herokuapp.com/http://ec2-35-158-214-30.eu-central-1.compute.amazonaws.com:3001/profile/updateProfileAdmin",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
          email: data.email,
          password: data.password,
        }),
      }
    )
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          throw new Error("Error creating User");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateAdmin = (data) => {
    console.log(data.password);
    fetch(
      "https://cors-anywhere.herokuapp.com/http://ec2-35-158-214-30.eu-central-1.compute.amazonaws.com:3001/admin/updateAdmin",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
          email: data.email,
          password: data.password,
        }),
      }
    )
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          throw new Error("Error creating User");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const createAdmin = (data) => {
    fetch(
      "https://cors-anywhere.herokuapp.com/http://ec2-35-158-214-30.eu-central-1.compute.amazonaws.com:3001/admin/signup",
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
          email: data.email,
          password: data.password,
        }),
      }
    )
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          throw new Error("Error creating User");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  React.useEffect(() => {
    if (qrValue !== "") {
      const card = document.getElementById("card");

      const canvas = document.getElementById("123456");
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      var c = document.getElementById("canvas");
      var ctx = c.getContext("2d");
      ctx.drawImage(card, 0, 0, 550, 366);
      ctx.drawImage(canvas, 400, 250, 50, 50);
      var link = document.createElement("a");
      link.download = id + ".png";
      link.href = document.getElementById("canvas").toDataURL();
      link.click();
    }
  }, [qrValue]);
  return (
    <div className="userTable">
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Number of users</p>
              <h3 className={classes.cardTitle}>{data.length}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                {timeUpdate}
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Number of admins</p>
              <h3 className={classes.cardTitle}>{dataAdmin.length}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                {timeUpdate}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <MaterialTable
        icons={tableIcons}
        columns={[
          { title: "Id", field: "id" },
          { title: "Email", field: "email" },
          { title: "Password", field: "password" },
        ]}
        data={data}
        actions={[
          {
            icon: "perm_media",
            tooltip: "QR image",
            onClick: (event, rowData) => {
              setQrValue("http://localhost:3000/profile-page/" + rowData.id);
              setId(rowData.id);
            },
          },
          {
            icon: "search",
            tooltip: "Profile page",
            onClick: (event, rowData) => {
              var win = window.open(rowData.profile, "_blank");
              win.focus();
            },
          },
        ]}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              updateUser(newData);
              var array = [...data];
              var index = array.indexOf(oldData);
              array[index] = newData;
              array[index].password = "**********";
              setData(array);
              resolve();
            }),

          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              deleteUser(oldData.id);
              var array = [...data]; // make a separate copy of the array
              var index = array.indexOf(oldData);

              if (index !== -1) {
                array.splice(index, 1);
                setData(array);
              }
              resolve();
            }),
        }}
        options={{
          pageSize: 5,
          paging: true,
        }}
        localization={{
          pagination: {
            labelRowsPerPage: "6",
          },
        }}
        title="All users"
      />
      <div style={{ marginTop: "30px" }}>
        <MaterialTable
          icons={tableIcons}
          columns={[
            { title: "Email", field: "email" },
            { title: "Password", field: "password" },
          ]}
          data={dataAdmin}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  newData.password = "**********";
                  createAdmin(newData);
                  setDataAdmin([...dataAdmin, newData]);

                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                updateAdmin(newData);
                var array = [...dataAdmin];
                var index = array.indexOf(oldData);
                array[index] = newData;
                array[index].password = "**********";
                setDataAdmin(array);
                resolve();
              }),

            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                deleteAdmin(oldData.id);
                var array = [...dataAdmin]; // make a separate copy of the array
                var index = array.indexOf(oldData);

                if (index !== -1) {
                  array.splice(index, 1);
                  setDataAdmin(array);
                }
                resolve();
              }),
          }}
          options={{
            pageSize: 5,
            paging: true,
          }}
          localization={{
            pagination: {
              labelRowsPerPage: "6",
            },
          }}
          title="Admins"
        />
      </div>
      <div style={{ display: "none" }}>
        <canvas id="canvas" width="550" height="336"></canvas>
        <img src={card} alt={"logo"} id="card" />
        <QRCode
          id="123456"
          value={qrValue}
          size={50}
          level={"H"}
          includeMargin={true}
        />
      </div>
    </div>
  );
}
