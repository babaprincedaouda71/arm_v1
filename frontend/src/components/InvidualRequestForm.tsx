import { useState } from "react";
import CrossIcon from "./Svgs/CrossIcon";

const InvidualRequestForm = () => {
  const [formData, setFormData] = useState({
    site: "",
    department: "",
    domain: "",
    theme: "",
    numberDay: "",
    type: "",
    qualification: "",
    csf: "",
    numbersOfGroup: "",
    objective: "",
    content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full  h-[679px]">
      <div className="flex justify-between mb-4 border-b-[1px] pb-4 border-[#EFF4FA]">
        <h2 className="text-[16px] font-[700]  ">
          Add New Theme in Internal Catalog
        </h2>
        <CrossIcon />
      </div>

      <form className="flex flex-wrap gap-4 px-[90px] py-[30px]">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col justify-around w-full sm:w-[35%] space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-[13px] font-[600]">Site</label>
              <select
                name="site"
                value={formData.site}
                onChange={handleChange}
                className="w-[219.64px] p-2 border-[1px]  outline-none border-[#EFF4FA] rounded-lg h-[40px] bg-[#F9FAFB]"
              >
                <option value="">Select Site</option>
                {/* Add options here */}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <label className="block text-[13px] font-[600]">Domain</label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="w-[219.64px] p-2 border-[1px] outline-none border-[#EFF4FA] rounded-lg h-[40px] bg-[#F9FAFB]"
              >
                <option value="">Select Domain</option>
                {/* Add options here */}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <label className="block text-[13px] font-[600]">Number Day</label>
              <input
                type="text"
                name="numberDay"
                value={formData.numberDay}
                onChange={handleChange}
                className="w-[219.64px] p-2 border-[1px] outline-none border-[#EFF4FA] rounded-lg h-[40px] bg-[#F9FAFB]"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="block text-[13px] font-[600]">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-[219.64px] p-2 border-[1px] outline-none border-[#EFF4FA] rounded-lg h-[40px] bg-[#F9FAFB]"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="block text-[13px] font-[600]">
                Numbers of Group
              </label>
              <input
                type="text"
                name="numbersOfGroup"
                value={formData.numbersOfGroup}
                onChange={handleChange}
                className="w-[219.64px] p-2 border-[1px] outline-none border-[#EFF4FA] rounded-lg h-[40px] bg-[#F9FAFB]"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between w-full sm:w-[35%] space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-[13px] font-[600]">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-[219.64px] p-2 border-[1px] outline-none border-[#EFF4FA] rounded-lg h-[40px] bg-[#F9FAFB]"
              >
                <option value="">Select Department</option>
                {/* Add options here */}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <label className="block text-[13px] font-[600]">Theme</label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="w-[219.64px] p-2 border-[1px] outline-none border-[#EFF4FA] rounded-lg h-[40px] bg-[#F9FAFB]"
              >
                <option value="">Select Theme</option>
                {/* Add options here */}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <label className="block text-[13px] font-[600]">Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-[219.64px] p-2 border-[1px] outline-none border-[#EFF4FA] rounded-lg h-[40px] bg-[#F9FAFB]"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="block text-[13px] font-[600]">CSF</label>
              <input
                type="text"
                name="csf"
                value={formData.csf}
                onChange={handleChange}
                className="w-[219.64px] p-2 border-[1px] outline-none border-[#EFF4FA] rounded-lg h-[40px] bg-[#F9FAFB]"
              />
            </div>
          </div>
        </div>

        <div className="flex  mt-4 w-full">
          <label className="block mr-5 text-[13px] font-[600]">Objective</label>
          <textarea
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            className=" w-full  p-2 border-[1px] outline-none border-[#EFF4FA] rounded-lg h-[70px] bg-[#F9FAFB]"
            rows={3}
          ></textarea>
        </div>
        <div className="flex justify-start mt-4 w-full">
          <label className="block mr-5 text-[13px] font-[600]">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full  p-2 border-[1px] outline-none border-[#EFF4FA] rounded-lg h-[70px] bg-[#F9FAFB]"
            rows={3}
          ></textarea>
        </div>

        <div className="flex w-full justify-center space-x-4 mt-4">
          <button type="button" className="text-black font-[500]">
            No! Cancel
          </button>
          <button
            type="submit"
            className="bg-[#FFE167] text-black font-[500] px-8 py-4 rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvidualRequestForm;
