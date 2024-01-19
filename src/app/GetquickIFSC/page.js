'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const GetquickIFSC = () => {

    const searchParams = useSearchParams();
    let bank = searchParams.get('bank');
    let branch = searchParams.get('branch');
    let city = searchParams.get('city');
    const [bankData, setBankData] = useState([])

    useEffect(() => {
        async function getBankDetails() {
            try {
                let response = await fetch('http://localhost:5000/api/quickSearch/search', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        bankName: bank,
                        cityName: city,
                        branchName: branch
                    })
                });
                let bankData = await response.json();
                setBankData(bankData.data);
            } catch (error) {
                console.log(error);
            }
        }

        getBankDetails();
    }, [bank, branch, city]);

    return (
        <div className="container mx-auto p-4">
            <table className="table-auto w-full border-collapse border border-gray-800">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">IFSC</th>
                        <th className="p-2">Bank</th>
                        <th className="p-2">Branch</th>
                        <th className="p-2">City</th>
                        <th className="p-2">District</th>
                        <th className="p-2">State</th>
                        <th className="p-2">Address</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        bankData.map((bank) => (
                            <tr className="bg-gray-100 border-b border-gray-800">
                                <td className="p-2 text-center">{bank._source.IFSC}</td>
                                <td className="p-2 text-center">{bank._source.BANK}</td>
                                <td className="p-2 text-center">{bank._source.BRANCH}</td>
                                <td className="p-2 text-center">{bank._source.CENTRE}</td>
                                <td className="p-2 text-center">{bank._source.DISTRICT}</td>
                                <td className="p-2 text-center">{bank._source.STATE}</td>
                                <td className="p-2 text-center">{bank._source.ADDRESS}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default GetquickIFSC