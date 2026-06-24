import { useEffect, useState } from "react";
import "../../pages/ProfilePage.css";

import {
getAddresses,
createAddress,
updateAddress,
deleteAddress,
} from "../../api/address";

export default function AddressCard() {
const emptyAddress = {
label: "",
addressLine1: "",
addressLine2: "",
city: "",
state: "",
postalCode: "",
country: "India",
isDefault: false,
};

const [addresses, setAddresses] =
useState([]);

const [showForm, setShowForm] =
useState(false);

const [editingId, setEditingId] =
useState(null);

const [formData, setFormData] =
useState(emptyAddress);

useEffect(() => {
loadAddresses();
}, []);

const loadAddresses = async () => {
try {
const response =
await getAddresses();

``
  setAddresses(
    response.data || []
  );
} catch (error) {
  console.error(error);
}


};

const handleCreate = async () => {
try {
await createAddress(
formData
);


  setShowForm(false);
  setFormData(
    emptyAddress
  );

  loadAddresses();
} catch (error) {
  console.error(error);
}


};

const startEdit = (
address
) => {
setEditingId(address.id);
setFormData(address);
setShowForm(true);
};

const handleUpdate = async () => {
try {
await updateAddress(
editingId,
formData
);


  setShowForm(false);
  setEditingId(null);
  setFormData(
    emptyAddress
  );

  loadAddresses();
} catch (error) {
  console.error(error);
}


};

const handleDelete = async (
id
) => {
try {
await deleteAddress(
id
);


  loadAddresses();
} catch (error) {
  console.error(error);
}


};

return ( <div className="profile-card"> <div className="card-header"> <h3>My Addresses</h3>


    <button
      className="save-btn"
      onClick={() => {
        setEditingId(null);
        setFormData(
          emptyAddress
        );
        setShowForm(true);
      }}
    >
      Add Address
    </button>
  </div>

  {showForm && (
    <div className="address-form">
      <input
        placeholder="Label"
        value={formData.label}
        onChange={(e) =>
          setFormData({
            ...formData,
            label:
              e.target.value,
          })
        }
      />

      <input
        placeholder="Address Line 1"
        value={
          formData.addressLine1
        }
        onChange={(e) =>
          setFormData({
            ...formData,
            addressLine1:
              e.target.value,
          })
        }
      />

      <input
        placeholder="Address Line 2"
        value={
          formData.addressLine2
        }
        onChange={(e) =>
          setFormData({
            ...formData,
            addressLine2:
              e.target.value,
          })
        }
      />

      <input
        placeholder="City"
        value={formData.city}
        onChange={(e) =>
          setFormData({
            ...formData,
            city:
              e.target.value,
          })
        }
      />

      <input
        placeholder="State"
        value={formData.state}
        onChange={(e) =>
          setFormData({
            ...formData,
            state:
              e.target.value,
          })
        }
      />

      <input
        placeholder="Postal Code"
        value={
          formData.postalCode
        }
        onChange={(e) =>
          setFormData({
            ...formData,
            postalCode:
              e.target.value,
          })
        }
      />

      <button
        className="save-btn"
        onClick={
          editingId
            ? handleUpdate
            : handleCreate
        }
      >
        {editingId
          ? "Update Address"
          : "Create Address"}
      </button>
    </div>
  )}

  <div className="address-grid">
    {addresses.map(
      (address) => (
        <div
          key={address.id}
          className="address-card"
        >
          {address.isDefault && (
            <span className="default-badge">
              Default
            </span>
          )}

          <h4>
            {address.label}
          </h4>

          <p>
            {
              address.addressLine1
            }
          </p>

          {address.addressLine2 && (
            <p>
              {
                address.addressLine2
              }
            </p>
          )}

          <p>
            {address.city},{" "}
            {address.state}
          </p>

          <p>
            {
              address.postalCode
            }
          </p>

          <p>
            {address.country}
          </p>

          <div className="address-actions">
            <button
              onClick={() =>
                startEdit(
                  address
                )
              }
            >
              Edit
            </button>

            <button
              onClick={() =>
                handleDelete(
                  address.id
                )
              }
            >
              Delete
            </button>
          </div>
        </div>
      )
    )}
  </div>
</div>
);
}
