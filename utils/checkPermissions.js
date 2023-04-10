
const checkPermissions=(LoggedInUser, resourceUserID,)=>{
  if(LoggedInUser.role==='admin')return;
  if(LoggedInUser.userID===resourceUserID.toString())return;
  throw new Error;
};

module.exports={checkPermissions}