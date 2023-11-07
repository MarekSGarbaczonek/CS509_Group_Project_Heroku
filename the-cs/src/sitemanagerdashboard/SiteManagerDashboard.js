import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import './SiteManagerDashboard.css';
import React from 'react';
import $ from 'jquery';
import { v4 as uuidv4 } from 'uuid';

const instance = axios.create({
    baseURL: 'https://iggshnplye.execute-api.us-east-2.amazonaws.com/Initial/'
});

function SiteManagerDashboard(props) {

    // On Render
    useEffect(() => {
        // Getting the Company Names and Adding them to the Dropdown
        instance.post("fetchStore")
            .then(function (response) {
                console.log(response)
                for (let company of JSON.parse(response.data.body)) {
                    let dropdownItem = document.createElement("option");
                    dropdownItem.innerHTML = company.STName;
                    dropdownItem.setAttribute("data-UUID", company.StoreID)
                    document.getElementById("remove-store-options").appendChild(dropdownItem);
                }
            })
            .catch(function (error) {
                console.log(error);
            })

        // Reporting the Inventory
        instance.post("reportInventory")
            .then(function (response) {
                document.getElementById("total-inventory").innerHTML = JSON.parse(response.data.body).InventoryTotal;
            })
            .catch(function (error) {
                console.log(error);
            })
    });

    $(function () {
        $('#remove-store-button').on("click", async() => {
            const storeID = $('select option:selected').attr("data-UUID"); // CHANGE ME TO CORRECT GENERATION OF ID
            // API Call to Remove Store from DB
            console.log(storeID)
            await instance.post("removeStore", { "StoreID": storeID })
                .then(function (response) {
                    window.alert("Store Removed!");
                })
                .catch(function (error) {
                    console.log(error);
                })
                this.location.reload();
        });
    });

    const navigate = useNavigate();

    return (
        <div className="container">
            <div>{"Total Inventory: "}</div>
            <label id="total-inventory"></label>
            <div>{"Remove Store:"}</div>
            <select id="remove-store-options"></select>
            <button id="remove-store-button">Remove Store</button>
        </div>
    )
};

export default SiteManagerDashboard;