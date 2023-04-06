
const checkPermissions=(LoggedInUser, resourceUserID, res)=>{
  if(LoggedInUser.role==='admin')return;
  if(LoggedInUser.userID===resourceUserID.toString())return;
  res.status(401).json({msg:'Unauthorized'})
};

module.exports={checkPermissions}