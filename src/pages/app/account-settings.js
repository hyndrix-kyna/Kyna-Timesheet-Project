import { useEffect, useState } from "react";
import { useSession, getSession, signIn } from "next-auth/react"; // Import signIn for session refresh
import { useRouter } from "next/router";

export default function AccountSettings() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    status: "",
    employeeNo: "",
    username: "",
    currentPassword: "",
    password: "",
    confirmPassword: ""
  });
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch user data
      fetch(`/api/user/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            gender: data.gender || "",
            status: data.status || "",
            employeeNo: data.employeeNo || "",
            username: data.username || "",
            currentPassword: "",
            password: "",
            confirmPassword: ""
          });
        })
        .catch((err) => console.error("Failed to fetch user data", err));
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure new passwords match if they are being updated
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Ensure current password is provided for updates
    if (!formData.currentPassword) {
      alert("Please enter your current password to confirm changes.");
      return;
    }

    const res = await fetch(`/api/user/${session.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert("Account updated successfully!");

      // Force session reload to reflect updated user data
      await signIn('credentials', { redirect: false });  // Refresh the session without redirecting

      router.push("/app/dashboard");
    } else {
      alert("Failed to update account");
    }
  };

  if (!session) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full border p-2 mb-4"
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full border p-2 mb-4"
          />
        </div>
        <div>
          <label>Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full border p-2 mb-4"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full border p-2 mb-4"
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label>Employee No</label>
          <input
            type="text"
            value={formData.employeeNo}
            readOnly
            className="w-full border p-2 mb-4 bg-gray-100"
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full border p-2 mb-4"
          />
        </div>
        <div>
          <label>Current Password</label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full border p-2 mb-4"
            required
          />
        </div>
        <div>
          <label>New Password (optional)</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full border p-2 mb-4"
          />
        </div>
        <div>
          <label>Confirm Password (optional)</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full border p-2 mb-4"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/account/login",
        permanent: false
      }
    };
  }

  return {
    props: { session }
  };
}
