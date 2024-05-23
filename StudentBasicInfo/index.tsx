
import React, { useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
// import { toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useAPI";
import {
  LocalizationProvider,
  DateTimePicker,
  DatePicker,
} from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QUERY_KEYS_STUDENT } from "../../utils/const";
import { useNavigate, useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";

interface StudentBasicInformation {
  student_id?: number;
  first_name?: string;
  last_name?: string;
  gender?: string;
  dob?: Dayjs | null;
  father_name?: string;
  mother_name?: string;
  guardian_name?: string;
  pic_path?: string;
  aim?: string;
}

function StudentBasicInfo() {
  let StudentId = localStorage.getItem("_id");
  console.log(StudentId);
  const { getData, postData, putData } = useApi();
  const [gender, setGender] = useState("Male");
  const [name, setName] = useState();
  const [lastname, setlastName] = useState();
  const [dob, setDob] = useState<Date | null>();
  const [selectedFile, setSelectedFile] = useState();
  const [filePreview, setFilePreview] = useState(null);
  const [editFalg, setEditFlag] = useState<boolean>(false);
  const someDate = dayjs(); // Creating a Dayjs object representing the current date and time

  const [basicInfo, setBasicInfo] = useState<StudentBasicInformation>({
    student_id: 0,
    first_name: "",
    last_name: "",
    gender: "male",
    dob: dayjs("2024-05-10"),
    father_name: "",
    mother_name: "",
    guardian_name: "",
    pic_path: "",
    aim: "",
  });

  useEffect(() => {
    getData(`${"student/get/" + StudentId}`, StudentId)
      .then((data: any) => {
        console.log(data);
        // setBasicInfo(data);

        if (data?.status === 200) {
          setBasicInfo(data?.data);
          // setSelectedFile(data?.data?.pic_path);
          console.log(typeof data?.data?.gender);
        } else if (data?.status === 404) {
          setEditFlag(true);
        } else {
          console.log("error comes from api");
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
    if (Object.keys(basicInfo).length === 0) {
      //postData(`${'student/add'}`)
    }
  }, []);

  const [error, setError]: any = useState({});

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
    >
  ) => {
    const { name, value } = event.target;
    setBasicInfo((values) => ({ ...values, [name]: value }));
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const datachange = (event: Date | null) => {
    setDob(event);
  };

  // const handleDate = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  //     handleChange(event.target.value as Date | null);
  //   };
  const handleDateChange = (newDate: Dayjs | null) => {
    setBasicInfo((values) => ({ ...values, dob: newDate }));
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    father_name: "",
    mother_name: "",
    guardian_name: "",
    pic_path: "",
    aim: "",
  });

  // const validate = () => {
  //     const validationError: any = {}

  //     if (!formData.first_name) {
  //         validationError.first_name = "First Name is required";
  //     }

  //     if (!formData.last_name) {
  //         validationError.last_name = "Last Name is required";
  //     }

  //     if (!formData.gender) {
  //         validationError.gender = "Gender is required";
  //     }

  //     if (!formData.dob) {
  //         validationError.dob = "Date of Birth is required";
  //     }

  //     if (!formData.father_name) {
  //         validationError.father_name = "Father Name is required";
  //     }

  //     if (!formData.mother_name) {
  //         validationError.mother_name = "Mother Name is required"
  //     }

  //     if (!formData.guardian_name) {
  //         validationError.guardian_name = "Guardian Name is required"
  //     }

  //     if (!formData.aim) {
  //         validationError.aim = "Aim is required"
  //     }

  //     if (!formData.pic_path) {
  //         validationError.pic_path = "Profile Picture is required"
  //     }
  //     setError(validationError)
  //     return Object.keys(validationError).length === 0 ? true : false;
  //     // if (Object.keys(validationError).length === 0) {
  //     //     toast.success("Basic Info Added Successfully")
  //     // }
  // }

  const submitHandel = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const validation = validate()
    // if (validation == true) {
    let payload = {
      student_login_id: StudentId,
      first_name: basicInfo.first_name,
      last_name: basicInfo.last_name,
      gender: basicInfo.gender,
      dob: basicInfo.dob || null,
      father_name: basicInfo.father_name,
      mother_name: basicInfo.mother_name,
      guardian_name: basicInfo.guardian_name,
      pic_path: basicInfo.pic_path,
      aim: basicInfo.aim,
    };
    if (editFalg) {
      postData(`${"student/add"}`, payload)
        .then((data: any) => {
          toast.success(data?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    } else {
      putData(`${"student/edit/"}${StudentId}`, payload)
        .then((data: any) => {
          toast.success(data?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    }
    console.log(payload);
    // }
  };

  return (
    <form onSubmit={submitHandel}>
      <div className="row d-flex mt-5">
        <div className="col-md-6 pb-3">
          <label>
            {" "}
            First Name <span>*</span>
          </label>
          <TextField
            type="text"
            name="first_name"
            className="form-control"
            value={basicInfo.first_name}
            onChange={handleChange}
            required
          />
          {/* {error.first_name && <span style={{ color: 'red' }}>{error.first_name}</span>} */}
        </div>

        <div className="col-md-6 pb-3">
          <label>
            {" "}
            Last Name <span>*</span>
          </label>
          <TextField
            type="text"
            name="last_name"
            className="form-control"
            value={basicInfo.last_name || ""}
            onChange={handleChange}
            required
          />
          {/* {error.last_name && <span style={{ color: 'red' }}>{error.last_name}</span>} */}
        </div>

        <div className="col-md-6 pb-3">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Gender
            </FormLabel>
            <RadioGroup
              row
              name="gender"
              value={basicInfo.gender}
              onChange={handleChange}
            >
              <FormControlLabel
                value="male"
                control={<Radio required />}
                label="Male"
              />
              <FormControlLabel
                value="female"
                control={<Radio required />}
                label="Female"
              />
            </RadioGroup>
          </FormControl>
          <div>
            {error.gender && (
              <span style={{ color: "red" }}>{error.gender}</span>
            )}
          </div>
        </div>
        <div className="col-md-6 pb-3">
          <Typography variant="body1">
            Date of Birth <span>*</span>
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              // label="Date of Birth"
              value={dayjs(basicInfo.dob)}
              onChange={handleDateChange}
              disableFuture
            />
          </LocalizationProvider>
          {/* <div>{error.dob && <span style={{ color: 'red' }}>{error.dob}</span>}</div> */}
        </div>

        <div className="col-md-6 pb-3">
          <label>
            {" "}
            Father name <span>*</span>
          </label>
          <TextField
            type="text"
            name="father_name"
            className="form-control"
            value={basicInfo.father_name}
            onChange={handleChange}
            required
          />
          {/* {error.father_name && <span style={{ color: 'red' }}>{error.father_name}</span>} */}
        </div>

        <div className="col-md-6 pb-3 ">
          <label>
            {" "}
            Mother Name <span>*</span>
          </label>
          <TextField
            type="text"
            name="mother_name"
            className="form-control"
            value={basicInfo.mother_name}
            onChange={handleChange}
            required
          />
          {/* {error.mother_name && <span style={{ color: 'red' }}>{error.mother_name}</span>} */}
        </div>

        <div className="col-md-6 pb-3">
          <label>
            {" "}
            Guardian Name <span>*</span>
          </label>
          <TextField
            type="text"
            name="guardian_name"
            className="form-control"
            value={basicInfo.guardian_name}
            onChange={handleChange}
            required
          />
          {/* {error.guardian_name && <span style={{ color: 'red' }}>{error.guardian_name}</span>} */}
        </div>

        <div className="col-md-6 pb-3">
          <label>
            {" "}
            Aim <span>*</span>
          </label>
          <TextField
            type="text"
            name="aim"
            className="form-control"
            value={basicInfo.aim}
            onChange={handleChange}
            required
          />
          {/* {error.aim && <span style={{ color: 'red' }}>{error.aim}</span>} */}
        </div>

        <div className="col-md-6 pb-3">
          <Grid item xs={12}>
            <Typography variant="h6">
              Upload Profile Photo <span>*</span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              name="pic_path"
              accept=".image/*"
              // value={basicInfo.pic_path}
              onChange={(e) => {
                handleChange(e);
                const { files } = e.target;

                if (files && files[0]) {
                  const file: any = files[0];
                  const reader: any = new FileReader();
                  reader.onloadend = () => {
                    setFilePreview(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              required
            />

            {selectedFile && (
              <Typography variant="body1">{selectedFile}</Typography>
            )}
          </Grid>
          {filePreview && (
            <img
              src={filePreview}
              alt="Uploaded Preview"
              style={{ maxWidth: "50%", marginTop: "10px" }}
            />
          )}
          {/* {error.pic_path && <span style={{ color: 'red' }}>{error.pic_path}</span>} */}
        </div>
      </div>
      <div className="d-flex justify-content-center mt-5">
        <button className="btn btn-primary sunbutton" type="submit">
          Save
        </button>
      </div>
    </form>
  );
}

export default StudentBasicInfo;

