// components/PanelMembers.js

import React from 'react';

const panelMembers = [
{
    name: 'Ahsan Ali',
    designation: 'President',
    departmentYear: 'Environmental Science, 3rd Year',
    avatarUrl: 'https://thumbs.dreamstime.com/b/isolated-object-avatar-dummy-sign-set-avatar-image-vector-icon-stock-vector-design-avatar-dummy-logo-137161322.jpg',
},
{
    name: 'Fatima Khan',
    designation: 'Vice President',
    departmentYear: 'Biology, 2nd Year',
    avatarUrl: 'https://thumbs.dreamstime.com/b/isolated-object-avatar-dummy-sign-set-avatar-image-vector-icon-stock-vector-design-avatar-dummy-logo-137161322.jpg',
},
{
    name: 'Rafiq Rahman',
    designation: 'Secretary',
    departmentYear: 'Chemistry, 1st Year',
    avatarUrl: 'https://thumbs.dreamstime.com/b/isolated-object-avatar-dummy-sign-set-avatar-image-vector-icon-stock-vector-design-avatar-dummy-logo-137161322.jpg',
},
{
    name: 'Nadia Islam',
    designation: 'Treasurer',
    departmentYear: 'Physics, 4th Year',
    avatarUrl: 'https://thumbs.dreamstime.com/b/isolated-object-avatar-dummy-sign-set-avatar-image-vector-icon-stock-vector-design-avatar-dummy-logo-137161322.jpg',
},
{
    name: 'Sajid Ahmed',
    designation: 'Member',
    departmentYear: 'Geology, 2nd Year',
    avatarUrl: 'https://thumbs.dreamstime.com/b/isolated-object-avatar-dummy-sign-set-avatar-image-vector-icon-stock-vector-design-avatar-dummy-logo-137161322.jpg',
},
{
    name: 'Laila Noor',
    designation: 'Member',
    departmentYear: 'Botany, 3rd Year',
    avatarUrl: 'https://thumbs.dreamstime.com/b/isolated-object-avatar-dummy-sign-set-avatar-image-vector-icon-stock-vector-design-avatar-dummy-logo-137161322.jpg',
},
{
    name: 'Tariq Hasan',
    designation: 'Member',
    departmentYear: 'Zoology, 1st Year',
    avatarUrl: 'https://thumbs.dreamstime.com/b/isolated-object-avatar-dummy-sign-set-avatar-image-vector-icon-stock-vector-design-avatar-dummy-logo-137161322.jpg',
},
{
    name: 'Maya Chowdhury',
    designation: 'Member',
    departmentYear: 'Marine Biology, 4th Year',
    avatarUrl: 'https://thumbs.dreamstime.com/b/isolated-object-avatar-dummy-sign-set-avatar-image-vector-icon-stock-vector-design-avatar-dummy-logo-137161322.jpg',
},
{
    name: 'Imran Hossain',
    designation: 'Member',
    departmentYear: 'Environmental Engineering, 2nd Year',
    avatarUrl: 'https://thumbs.dreamstime.com/b/isolated-object-avatar-dummy-sign-set-avatar-image-vector-icon-stock-vector-design-avatar-dummy-logo-137161322.jpg',
},
{
    name: 'Rina Akter',
    designation: 'Member',
    departmentYear: 'Ecology, 3rd Year',
    avatarUrl: 'https://thumbs.dreamstime.com/b/isolated-object-avatar-dummy-sign-set-avatar-image-vector-icon-stock-vector-design-avatar-dummy-logo-137161322.jpg',
},
{
    name: 'Zahid Karim',
    designation: 'Member',
    departmentYear: 'Sociology, 2nd Year',
    avatarUrl: 'https://thumbs.dreamstime.com/b/isolated-object-avatar-dummy-sign-set-avatar-image-vector-icon-stock-vector-design-avatar-dummy-logo-137161322.jpg',
},
{
    name: 'Farah Begum',
    designation: 'Member',
    departmentYear: 'Anthropology, 1st Year',
    avatarUrl: 'https://thumbs.dreamstime.com/b/isolated-object-avatar-dummy-sign-set-avatar-image-vector-icon-stock-vector-design-avatar-dummy-logo-137161322.jpg',
}
];

const PanelMembers = () => {
  return (
<div className="container mt-16 mx-auto px-4 py-8">
  <h2 className="text-3xl font-extrabold mb-8 text-green-800 text-center">Panel Members</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {panelMembers.map((member, index) => (
      <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:bg-green-100 transition duration-300 transform hover:scale-105">
        <img
          src={member.avatarUrl}
          alt={member.name}
          className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-green-400"
        />
        <h3 className="text-xl font-bold text-center text-green-900">{member.name}</h3>
        <p className="text-center text-gray-700">{member.designation}</p>
        <p className="text-center text-gray-600">{member.departmentYear}</p>
      </div>
    ))}
  </div>
</div>
  );
};

export default PanelMembers;