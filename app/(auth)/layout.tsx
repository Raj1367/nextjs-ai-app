import React from 'react'

const Authlayout = (
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>
) => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      {children}
    </div>
  )
}

export default Authlayout