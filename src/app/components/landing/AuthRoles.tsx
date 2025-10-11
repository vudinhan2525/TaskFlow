import Button from "@libs/app/components/general-components/button";
import { motion } from "motion/react";

export default function AuthRoles() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-[#6b9bd8] via-[#5ba3a3] to-emerald-500 px-6 py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-4xl font-bold text-white">
            Laravel Authorization & Roles Management
          </h2>
          <p className="text-white/90">Best Feature Available in My-Task App</p>
        </div>

        <div className="mb-12 flex justify-center gap-4">
          <Button
            variant="outline"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20"
          >
            Login
          </Button>
          <Button className="bg-pink-500 text-white hover:bg-pink-600">
            User Management
          </Button>
          <Button
            variant="outline"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20"
          >
            Role Management
          </Button>
        </div>

        <div className="grid items-start gap-12 md:grid-cols-2">
          <div className="text-white">
            <h3 className="mb-6 text-3xl font-bold">User Management</h3>
            <p className="mb-4 text-lg leading-relaxed text-white/90">
              The whole purpose of this post is about being dynamic. Especially,
              in systems with a different type of roles. We need to create a
              list of permissions in the system. Also, this list must be updated
              as the system developed.
            </p>
            <p className="text-lg leading-relaxed text-white/90">
              List of controllers and methods is a good representation of all
              permissions in the system. Every route is leading to a method of a
              controller. So, it's a good idea to make a list of permissions
              using the routes list.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b pb-4">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                Create User
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Search:</span>
                <input
                  type="text"
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {[
                      "TYPE",
                      "NAME",
                      "E-MAIL",
                      "VERIFIED",
                      "2FA",
                      "ROLES",
                      "ADDITIONAL PERMISSIONS",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-2 py-3 text-left font-semibold text-gray-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-2 py-3 text-gray-600">admin</td>
                    <td className="px-2 py-3 font-medium text-gray-800">
                      Super Admin
                    </td>
                    <td className="px-2 py-3 text-gray-600">admin@demo.com</td>
                    <td className="px-2 py-3">
                      <span className="text-green-600">✓</span>
                    </td>
                    <td className="px-2 py-3">
                      <Button className="h-6 text-xs">Delete</Button>
                    </td>
                    <td className="px-2 py-3 text-gray-600">All</td>
                    <td className="px-2 py-3 text-gray-600">48 seconds ago</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-2 py-3 text-gray-600">user</td>
                    <td className="px-2 py-3 font-medium text-gray-800">
                      Test User
                    </td>
                    <td className="px-2 py-3 text-gray-600">user@user.com</td>
                    <td className="px-2 py-3 text-gray-600">Yes</td>
                    <td className="px-2 py-3">
                      <Button className="h-6 text-xs">Delete</Button>
                    </td>
                    <td className="px-2 py-3 text-gray-600">None</td>
                    <td className="px-2 py-3 text-gray-600">4 months ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
