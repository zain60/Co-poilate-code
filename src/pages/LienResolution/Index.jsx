import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from '../../layout/AuthenticatedLayout'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import CaseCard from './partials/CaseCard';
import { getLienResolutionCases } from "../../services/cases";
import { useSelector } from 'react-redux';
import { message } from 'antd';

const LienResolution = () => {
  const breadcrumbLinks = [
    { label: "Home", href: "/" },
    { label: "Lien Resolution" },
  ];

  const user = useSelector((state) => state.auth.user);
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");

  const filteredCases = search ?
    cases?.filter((c) =>
      c?.fullName?.toLowerCase()?.includes(search?.toLowerCase())
    ) : cases;

  useEffect(() => {
    localStorage.setItem('currentPage', 'lien');

    fetchAllCases();
  }, []);

  const fetchAllCases = () => {
    getLienResolutionCases(user?.id)
      .then((response) => {
        setCases(response?.cases);
      })
      .catch((err) => {
        message.error(err?.message || "Failed to fetch cases");
      });
  };

  return (
    <AuthenticatedLayout>
      <div className='lg:flex gap-2 justify-between'>
        <p className='fs-20 fw-600 text-blue-39'>Lien Resolution</p>
        <Breadcrumb links={breadcrumbLinks} />
      </div>

      <div className="p-6 bg-white rounded-xl shadow-sm mt-6  ">
        <div className="lg:flex xl:flex justify-between items-center relative mb-3">

          <div className="flex flex-col w-full">
            <h1 className="fs-16 fw-500 text-blue-39">Cases</h1>
          </div>

          <div className="flex  md:flex-row flex-col justify-end gap-4 w-full">
            <Input
              placeholder="Search by Name, Speciality or Address"
              prefix={<SearchOutlined className="text-gray-400" />}
              className=" md:max-w-sm order-1 md:order-0"
              size="large"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <hr />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {filteredCases?.map((caseItem) => (
            <CaseCard caseItem={caseItem} />
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default LienResolution