import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Upload, User, Calendar } from "lucide-react";

interface FormData {
  name: string;
  age: number;
  file?: File[];
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: 0,
    file: [],
  });

  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const ageOptions = [...Array(100).keys()].map((i) => i + 1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    const files =
      e.target instanceof HTMLInputElement && e.target.files
        ? Array.from(e.target.files)
        : [];

    if (id === "file") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        file: files,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, age, file } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("age", age.toString());

    if (file?.length) {
      file.forEach((f, i) => {
        formDataToSend.append(`file${i}`, f);
      });
    }

    try {
      const response = await fetch("http://localhost:5000/submit_data", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setSubmissionStatus("Data submitted successfully!");
        setFormData({ name: "", age: 0, file: [] });
      } else {
        setSubmissionStatus("Error submitting data: " + data.error);
      }
    } catch (error) {
      setSubmissionStatus("An error occurred: " + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative">
      {/* Background images */}
      <div className="absolute inset-0 z-0">
        <div className="hidden sm:block">
          <img
            src="https://plus.unsplash.com/premium_photo-1681995326134-cdc947934015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="w-full h-screen object-cover"
          />
        </div>
        <div className="sm:hidden">
          <img
            src="https://plus.unsplash.com/premium_photo-1664304370934-b21ea9e0b1f5?q=80&w=1883&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Frosty filter overlay */}
        <div className="absolute inset-0 backdrop-filter backdrop-blur-md bg-white bg-opacity-30"></div>
      </div>

      {/* Main content */}
      <Card className="w-full max-w-md bg-white bg-opacity-80 shadow-xl backdrop-filter backdrop-blur-lg relative z-10 border-none">
        <CardHeader className="bg-[#007BFF] text-white rounded-t-xl">
          <CardTitle className="text-2xl font-bold text-center">
            Healthcare Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAME */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-[#6C757D] flex items-center"
              >
                <User className="w-5 h-5 mr-2 text-[#007BFF]" />
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-[#A9D9AF] focus:border-[#28A745] focus:ring-[#28A745] w-full"
              />
            </div>

            {/* AGE */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-[#6C757D] flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-[#007BFF]" />
                Age
              </Label>
              <select
                id="age"
                value={formData.age.toString()}
                onChange={handleChange}
                required
                // className="border-[#A9D9AF] focus:border-[#28A745] focus:ring-[#28A745] w-full"
                className=" w-full rounded-md px-3 py-2 border border-[#A9D9AF] focus:outline-none focus:border-[#28A745] focus:ring-[#28A745] bg-gray-100"
              >
                {ageOptions.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>

            {/* FILE UPLOAD */}
            <div className="space-y-2">
              <Label
                htmlFor="file"
                className="text-[#6C757D] flex items-center"
              >
                <Upload className="w-5 h-5 mr-2 text-[#007BFF]" />
                File Upload
              </Label>
              <Input
                id="file"
                type="file"
                multiple
                onChange={handleChange}
                required
                className="border-[#A9D9AF] focus:border-[#28A745] focus:ring-[#28A745]"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              className="w-full bg-[#28A745] hover:bg-[#0056A4] text-white transition-colors duration-300"
            >
              Submit
            </Button>
          </form>
          {submissionStatus && (
            <div className="mt-4 text-center text-lg">{submissionStatus}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
