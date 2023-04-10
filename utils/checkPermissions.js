
const checkPermissions=(LoggedInUser, resourceUserID,flag)=>{
  if(LoggedInUser.role==='admin')return flag;
  if(LoggedInUser.userID===resourceUserID.toString())return flag;
  return flag=false;
};

module.exports={checkPermissions}