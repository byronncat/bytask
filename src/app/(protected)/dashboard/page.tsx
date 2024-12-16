export default function DashboardPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-700 rounded-full p-2">
            {/* Key Icon */}
            <span className="text-2xl">🔑</span>
          </div>
          <h1 className="text-2xl font-bold">Coding</h1>
          <span className="text-sm text-gray-400">Private</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md">
          Invite Workspace Members
        </button>
      </header>

      {/* Boards Section */}
      <section className="px-8 py-6">
        {/* Filters */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <select className="bg-gray-800 p-2 rounded-md focus:outline-none">
              <option>Most recently active</option>
            </select>
            <select className="bg-gray-800 p-2 rounded-md focus:outline-none">
              <option>Choose a collection</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search boards"
            className="bg-gray-800 p-2 rounded-md focus:outline-none"
          />
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-4 gap-4">
          {/* Create Board */}
          <div className="flex items-center justify-center bg-gray-800 rounded-lg h-32 text-gray-400">
            Create new board
          </div>

          {/* Individual Boards */}
          <div
            className="relative bg-cover bg-center rounded-lg h-32 flex items-end"
            style={{
              backgroundImage:
                "url('https://source.unsplash.com/featured/?nature')",
            }}
          >
            <div className="w-full bg-black bg-opacity-50 p-2">Temp</div>
          </div>

          <div className="relative bg-blue-700 rounded-lg h-32 flex items-end">
            <div className="w-full bg-black bg-opacity-50 p-2">
              Task Management
            </div>
          </div>

          <div
            className="relative bg-cover bg-center rounded-lg h-32 flex items-end"
            style={{
              backgroundImage:
                "url('https://source.unsplash.com/featured/?tech')",
            }}
          >
            <div className="w-full bg-black bg-opacity-50 p-2">
              Social Media App
            </div>
          </div>

          <div
            className="relative bg-cover bg-center rounded-lg h-32 flex items-end"
            style={{
              backgroundImage:
                "url('https://source.unsplash.com/featured/?music')",
            }}
          >
            <div className="w-full bg-black bg-opacity-50 p-2">Music App</div>
          </div>
        </div>
      </section>
    </div>
  );
}
