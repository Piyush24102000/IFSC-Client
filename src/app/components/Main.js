'use client'

import React, { useState } from 'react'
import { banks } from '@/utils/banks';
import { useRouter } from 'next/navigation';

const Main = () => {
    const router = useRouter()

    /* ----------StepByStep States------ */
    const [bank, setBank] = useState('')
    const [banksMatch, setBanksMatch] = useState([])
    const [city, setCity] = useState('')
    const [cities, setCities] = useState([])
    const [citiesMatch, setCitysMatch] = useState([])
    const [branch, setBranch] = useState('')
    const [branches, setBranches] = useState([])
    const [branchMatch, setBranchMatch] = useState([])

    /* ----------Quick States----------- */
    let [quickBank, setQuickBank] = useState('')
    let [quickBranch, setQuickBranch] = useState('')
    let [quickCity, setQuickCity] = useState('')


    /* Functions */

    function searchBanks(text) {
        let matches = banks.filter((bank) => {
            let regex = new RegExp(`${text}`, "gi")
            return bank.match(regex)
        })
        setBanksMatch(matches)
    }

    async function getCity(bankName) {
        try {
            let response = await fetch('http://localhost:5000/api/stepSearch/getCity', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    bankName
                })
            })
            const cityData = await response.json();
            const sortedCities = cityData.data
            setCities(sortedCities)
            setBank(bankName)
        }
        catch (e) {
            console.error('Error fetching city data:', e);
        }
    }

    function searchCity(text) {
        let matches = cities.filter((city) => {
            let regex = new RegExp(`${text}`, "gi")
            return city.match(regex)
        })
        setCitysMatch(matches)
    }

    async function getBranch(cityName) {
        try {
            let response = await fetch('http://localhost:5000/api/stepSearch/getBranch', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    bankName: bank,
                    cityName: cityName
                })
            })
            let branchData = await response.json();
            branchData = branchData.data
            let branches = []
            for (let i = 0; i < branchData.length; i++) {
                branches.push(branchData[i]._source.BRANCH)
            }
            setBranches(branches)
            setCity(cityName)

        } catch (error) {
            console.log(error)
        }
    }

    function searchBranch(text) {
        let matches = branches.filter((branch) => {
            let regex = new RegExp(`${text}`, "gi")
            return branch.match(regex)
        })
        setBranchMatch(matches)
    }
    function getIFSC() {
        router.push(`/GetIFSC?bank=${bank}&city=${city}&branch=${branch}`);
    }

    function getQuickIFSC() {
        quickBank = quickBank.toLowerCase()
        quickBranch = quickBranch.toUpperCase()
        quickCity = quickCity.toUpperCase()

        router.push(`/GetquickIFSC?bank=${quickBank}&city=${quickCity}&branch=${quickBranch}`)
    }


    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-6xl">
                {/* Left Partition */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Step Search</h2>
                    <div className="mb-4 relative">

                        {/* Bank Input */}
                        <label htmlFor="bank" className="block text-gray-600 border-b mb-2 pb-1">
                            Bank
                        </label>
                        <input id="bank" onChange={(e) => {
                            searchBanks(e.target.value);
                            getCity(e.target.value);
                        }}
                            autoComplete='off'
                            className="form-input border mt-1"
                            list="bankOptions"
                        />
                        <datalist id="bankOptions" className="absolute mt-2 w-60 bg-white border border-gray-300 shadow-md rounded-md">
                            {banksMatch && banksMatch.map((bank) => (
                                <option key={bank} value={bank} />
                            ))}
                        </datalist>

                        {/* City Input */}
                        <label htmlFor="bank" className="block text-gray-600 border-b mb-2 pb-1">
                            City
                        </label>
                        <input id="city" onChange={(e) => {
                            searchCity(e.target.value);
                            getBranch(e.target.value);
                        }}
                            autoComplete='off'
                            className="form-input border mt-1"
                            list="cityOptions"
                        />
                        <datalist id="cityOptions" className="absolute mt-2 w-60 bg-white border border-gray-300 shadow-md rounded-md">
                            {citiesMatch && citiesMatch.map((city) => (
                                <option key={city} value={city} />
                            ))}
                        </datalist>

                        {/* Branch Input */}
                        <label htmlFor="bank" className="block text-gray-600 border-b mb-2 pb-1">
                            Branch
                        </label>
                        <input id="branch" onChange={(e) => {
                            searchBranch(e.target.value);
                            setBranch(e.target.value);
                        }}
                            autoComplete='off'
                            className="form-input border mt-1"
                            list="branchOptions"
                        />
                        <datalist id="branchOptions" className="absolute mt-2 w-60 bg-white border border-gray-300 shadow-md rounded-md">
                            {branchMatch && branchMatch.map((branch) => (
                                <option key={branch} value={branch} />
                            ))}
                        </datalist>
                    </div>

                    {/* Button */}
                    <button onClick={() => { getIFSC() }} className="bg-blue-500 text-white py-2 px-4 mt-10 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                        Get IFSC
                    </button>
                </div>

                {/* Right Partition */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Quick Search</h2>
                    <div className="mb-4">
                        <label htmlFor="quickBank" className="block text-gray-600 border-b mb-2 pb-1">Bank</label>
                        <input type="text" autoComplete='off' onChange={(e) => { setQuickBank(e.target.value) }} id="quickBank" className="form-input border mt-1" />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="quickCity" className="block text-gray-600 border-b mb-2 pb-1">City</label>
                        <input type="text" autoComplete='off' onChange={(e) => { setQuickCity(e.target.value) }} id="quickBank" className="form-input border mt-1" />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="quickBranch" className="block text-gray-600 border-b mb-2 pb-1">Branch</label>
                        <input type="text" autoComplete='off' onChange={(e) => { setQuickBranch(e.target.value) }} id="quickBank" className="form-input border mt-1" />
                    </div>

                    <button onClick={() => { getQuickIFSC() }} className="bg-green-500 text-white py-2 px-4 mt-10 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                        Get IFSC
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Main