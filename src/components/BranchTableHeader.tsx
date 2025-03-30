const BranchTableHeader = () => {
  const headers = [
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'dailyMeasurements', label: 'Daily Measurements', align: 'center' },
    { id: 'overallAlert', label: 'Overall Alert', align: 'center' },
    { id: 'actions', label: '', align: 'center', srOnly: 'Actions' },
  ]

  return (
    <thead className="bg-gray-50">
      <tr>
        {headers.map((header) => (
          <th
            key={header.id}
            scope="col"
            className={`px-6 py-3 text-${header.align} text-xs font-medium text-gray-500 tracking-wider`}
          >
            {header.srOnly ? <span className="sr-only">{header.srOnly}</span> : header.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default BranchTableHeader
