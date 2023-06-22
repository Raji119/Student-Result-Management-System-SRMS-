
//To Access SideBar Contents
function loadHTML(url,viewUrl=null,loadData=null,hiddenValue=null,id=null) { 
    fetch(url)
        .then(response => response.text())
        .then(text => document.getElementById('showDiv').innerHTML = text);
        getClass=false;getSubjects=false;getExams=false;
        if(viewUrl!=null && loadData!=null){
           if(hiddenValue!=null)
              receiveData(viewUrl,loadData,hiddenValue,id);
            else
              receiveData(viewUrl,loadData);
        }     
}

var stu={};
var marks={};
var stuD={};

//To Send And Update Form Data
function sendData(insertURL,type="Insert",viewURL=null,loadData=null,id=null){

    let formControl = document.getElementsByClassName("form-control");

    let formData={};

    for(let i=0;i<formControl.length;i++){
      if(formControl[i].value!="")
      formData[formControl[i].name]=formControl[i].value;
    }
    if(type=="Insert"){
      formData["hiddenValue"]="1";
    }else if(type=="Update"){
      formData["hiddenValue"]="3";
    }

    $.ajax({
     url  :  insertURL,
     type : 'POST',
     data :formData,
     success : function(response){
      if(response.trim()=='true' || response=='success'){
         if(type=="Insert")
            type="Inserte";
         
        document.getElementById("output").innerHTML=`<div class="alert alert-success" role="alert">
         Record ${type}d Successfully
      </div>`;
      if(viewURL!=null && loadData!=null){
         receiveData(viewURL,loadData,'2',id);
      }
   }
      else{
         document.getElementById("output").innerHTML=`<div class="alert alert-warning" role="alert">
         Record Found Already...Cannot ${type}
      </div>`;
      }
      

      $('#output').css({display:"block"});
      $('#output').fadeOut(2000);

      setTimeout(function(){
      for(let i=0;i<formControl.length;i++){
         document.querySelector("[name ='"+formControl[i].name+"']").value="";
       }
      },1000);
      }
      
   })
   return false;
}
      
// RECEIVE DATA
function receiveData(viewURL,loadData,hiddenValue="2",id=null){
   let data;
   if(id!=null){
      data={'id':id,'hiddenValue':hiddenValue};
   }else{
      data={'hiddenValue':hiddenValue};
   }
   $.ajax({
         url  :  viewURL,
         type : 'POST',
         data :  data,
         dataType : "json",
         success : function(response){
         if(loadData=='dashboard'){
            dashboard(JSON.stringify(response));
         }
        else if(loadData=='class'){ 
            loadClass(response);  
         }     
       else if(loadData=='subjects'){
            loadSubjects(response);
         }
       else if(loadData=='classSub'){
            loadClassSub(response);
         }
       else if(loadData=='getClass'){ 
            loadGetClass(JSON.stringify(response));
         }
       else if(loadData=='getSubjects'){
         loadGetSubjects(JSON.stringify(response));
         }
       else if(loadData=='students'){
            loadStudents(response);
            stuD =response;
       }
       else if(loadData=='exams'){
             loadExams(response);
       }
       else if(loadData=='marks'){
          addMarks(response);
       }else if(loadData=='getSubByClass'){
         loadGetSubByClass(JSON.stringify(response));
       }else if(loadData=='getExams'){
         loadGetExams(JSON.stringify(response));
       }else if(loadData=='classExams'){
         loadClassExams(response);
       }else if(loadData=='getExamDates'){
         loadGetExamDates(JSON.stringify(response));
       }else if(loadData=='marksSub'){
         stu = response;
       }else if(loadData=='viewMarks'){
         // alert("HIi RECEIVED");
         marks =response;
       }else if(loadData=='marksList'){
         enteredSubMarks(JSON.stringify(response));
       }else if(loadData=='classExamsMarks'){
         loadClassExams(response,"true");
       }else if(loadData=='viewMarksStu'){
         //  alert("HIIREC");
         marks = response;
         viewMarksStu();
       }
   }
   
 });
 return false;
}


//LoadClassInfo
function loadClass(response){
let count=1;

setTimeout(function(){
$('#classInfo tfoot th').each(function (index) {
   if(index!=0 && index!=3){
     var title = $(this).text();
     $(this).html(`<input type="text" class=dt_search placeholder="Search `  + title + `" />`);
   }
});

$('#classInfo').DataTable({
   initComplete : function(){
       
      this.api().columns().every(function (index){
         let column = this;

              $('input', this.footer()).on('keyup change clear',function(){
               if(column.search !== this.value){
                  column.search(this.value).draw();
               }
              })
        
      })
   },
   // lengthMenu : [[10,25,50,-1],[10,25,50,'All']],
   destroy : true,
   data : response,
   columns: [
        { "render": function(){ return count++;}},                  
        { data: 'className'},
        { data: 'section' },
        { data: 'classID',
        render : function(data,type,row){
         
            return  `<div class="actions">
            <a href="#" id='${JSON.stringify(response[count-2])}' class="btn btn-sm bg-success-light mr-2 editClass">
            <i class="fas fa-pen"></i>
            </a>
            <a href="#" class="btn btn-sm bg-danger-light" onclick="deleteRecord('classes.php',${data},'classes.php','class');">
            <i class="fas fa-trash"></i>
            </a>
            </div>`;
                     }}                  
                  ] 
                 
               });//close datatable 
            },100)
            } 

// Edit Class
var modalWrap=null;
$(document).on('click','.editClass',function(){
   var cls = JSON.parse($(this).attr("id"));
         if(modalWrap!==null){
            modalWrap.remove();
         }
          modalWrap=document.createElement('div');
          modalWrap.innerHTML=`
          <div class="modal fade" tabindex="-1" id=editModal  aria-hidden="true">
   <div class="modal-dialog">
     <div class="modal-content">

       <div class="modal-header">
         <h5 class="modal-title" id="staticBackdropLabel">Edit Class</h5>
         <button type="button" class="btn-close btn btn-primary" data-dismiss="modal" aria-label="Close">X</button>
       </div>
       
       <form method="post">
        <div class="modal-body">

         <div class="row">

          <div class="col-12 col-sm-6">
            <div class="form-group">
             <label>Class</label>
             <input type="text" class="form-control" name="className" value="${cls.className}" id="className">
            </div>
         </div>

        <div class="col-12 col-sm-6">
            <div class="form-group">
                <label>Section</label>
                  <input type="text" class="form-control" name="section" value="${cls.section}" id="section">
             </div>
       </div>

          <input type="hidden" class="form-control" name="hiddenValue" value="3"> 
          <input type="hidden" class="form-control" name="classID" value="${cls.classID}"> 
         </div>
       </div>

      <div class="modal-footer">
      
         <button type="Submit" class="btn btn-primary" data-dismiss="modal" onclick="return sendData('./classes.php','update','classes.php','class');">Update</button>
         <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
         </div>
       </form>
     </div>

   </div>
 </div>
   </div>`;
       document.body.append(modalWrap);
       var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'),{backdrop: "static",keyboard:false});
       modal.show();
      
      }
   )

//LoadGetClass
function loadGetClass(response){

   let cls    = JSON.parse(response);
   let select = document.getElementById('getClass');
  
   let opt = select.options.length -1;

   for(let i=opt;i>0;i--){
      select.remove(i);
   }  

   for(i in cls){
     if(select.firstElementChild.value!=cls[i].classID){
      
      let option = document.createElement('option');
      let  text   =document.createTextNode(cls[i].className+" "+cls[i].section);
      option.appendChild(text);
      option.setAttribute("value",cls[i].classID);
      select.insertBefore(option,select.lastChild);
   }
 }
}

//loadGetSubjects
function loadGetSubjects(response){
   
   let sub   = JSON.parse(response);
   
   let select = document.getElementById('getSubjects');

   let opt = select.options.length -1;

   for(let i=opt;i>0;i--){
      select.remove(i);
   }  
   
   for(i in sub){
      if(select.firstElementChild.value!=sub[i].subID){
        let option = document.createElement('option');
        text       =document.createTextNode(sub[i].subCode+"   "+sub[i].subName);
        option.appendChild(text);
        option.setAttribute("value",sub[i].subID);
      select.insertBefore(option,select.lastChild);
      }
   }
}

//loadGetSubByClass
function loadGetSubByClass(response){
   
   let sub =JSON.parse(response);
   let listSub=` <div class="col-12">
   <h5 class="form-title"><span>Add Subjects Marks</span></h5>
                   </div>`;
                   let showSub = document.getElementById('showSub');

   if(sub.length>0){
     for(let i in sub) {
        listSub+=`<div class="col-12 col-sm-6">
        <div class="form-group">
                        <label> ${sub[i].subName}</label>
                        <input type="hidden" class="form-control" name="subID[${i}]" value=${sub[i].subID}>
                        <input type="number" class="form-control" name="totMarks[${i}]" placeholder="Enter Total Marks" min=0 max="" onfocus='isValid();' id=maxMarks required>
                        </div>
                        </div>
                        <div class="col-12 col-sm-6">
                        <div class="form-group">
                        <label>${sub[i].subName}</label>
                       <input type="number" class="form-control" name="minMarks[${i}]" placeholder="Enter Minimum Marks" min=0 max="" id=minMarks onfocus='isValid();' required>
                       </div>
                       </div>`;
         }
                     showSub.innerHTML=listSub;
                     document.getElementById('submitAddExam').style.display="block";
                     // let min=0,max=0;
                     // for(let i in sub) {
                     //   max =  document.getElementById(`totMarks[${i}]`).value;
                     //   document.getElementById(`minMarks[${i}]`).setAttribute("max",max);
                     // }
                  }else{
                     showSub.innerHTML=`<div class="col-12">
                     <h5>No Subjects Found</h5>
                                     </div>`;
                     document.getElementById('submitAddExam').style.display="none";
                  }
               }

               function isValid(){
                  let totMarks = document.getElementById('maxMarks');
                  let minMarks = document.getElementById('minMarks');

                  if(totMarks.value!=null)
                     minMarks.setAttribute("max",totMarks.value);
               
                  if(minMarks.value!=null)
                     totMarks.setAttribute("min",minMarks.value);
               }
            
               
               function loadGetExams(response){
                  let exam   = JSON.parse(response);
                  let select = document.getElementById('getExams');
                  let opt = select.options.length -1;

                  for(let i=opt;i>0;i--){
                     select.remove(i);
                  }

                  if(exam.length>0){
                  for(i in exam){
                     let option = document.createElement('option');
                     text       = document.createTextNode(exam[i].examName);
                     option.appendChild(text);
                     option.setAttribute("value",exam[i].examID);
                     select.insertBefore(option,select.lastChild);
                     
                  }               

               }
                }

//loadGetExamDates
function loadGetExamDates(response){
   
   let exam   = JSON.parse(response);
   let select = document.getElementById('getExamDates');
   let opt = select.options.length -1;


   for(let i=opt;i>0;i--){
      select.remove(i);
   }

   if(exam.length>0){
   for(i in exam){
      let option = document.createElement('option');
      text       = document.createTextNode(exam[i].examDate);
      option.appendChild(text);
      option.setAttribute("value",exam[i].examDate);
      select.insertBefore(option,select.lastChild);
      
   }
}
}

//LoadSubjectsInfo
function loadSubjects(response){
  let count=1;
  setTimeout(function(){
   $('#subjectsInfo tfoot th').each(function (index) {
      if(index!=0 && index!=3){
         var title = $(this).text();
         $(this).html(`<input type="text" class=dt_search placeholder="Search `  + title + `" />`);
      }
   });
   $('#subjectsInfo').DataTable({
      initComplete : function(){
         
         this.api().columns().every(function (index){
            let column = this;
            
            $('input', this.footer()).on('keyup change clear',function(){
               if(column.search !== this.value){
                     column.search(this.value).draw();
                  }
                 })
           
               })          
            },
            destroy : true,
            data :response,
            columns: [
               { "render": function(){ return count++;}},                  
               { data: 'subCode' },
               { data: 'subName'},
               { data: 'subID',
               render : function(data,type,row){
                  
                  return  `<div class="actions">
                  <a href="#" id=${JSON.stringify(response[count-2])} class="btn btn-sm bg-success-light mr-2 editSubject">
                  <i class="fas fa-pen"></i>
                  </a>
                              <a href="#" class="btn btn-sm bg-danger-light" onclick="deleteRecord('subjects.php',${data},'subjects.php','subjects');">
                              <i class="fas fa-trash"></i>
                              </a>
                              </div>`;
                           }}                  
          ]   
         });
      },100)
         
      }
      
      //Edit Subjects
      $(document).on('click','.editSubject',function(){
         var sub = JSON.parse($(this).attr("id"));
         if(modalWrap!==null){
            modalWrap.remove();
         }
         modalWrap=document.createElement('div');
         modalWrap.innerHTML=`
         <div class="modal fade" tabindex="-1" aria-labelledby="editClassModal" aria-hidden="true">
         <div class="modal-dialog">
         <div class="modal-content">
         
         <div class="modal-header">
         <h5 class="modal-title" id="staticBackdropLabel">Edit Subjects</h5>
         <button type="button" class="btn-close btn btn-primary" data-dismiss="modal" aria-label="Close">X</button>
         </div>
         
         <form method="post">
         <div class="modal-body">
         
         <div class="row">
         
         <div class="col-12 col-sm-6">
         <div class="form-group">
         <label>Subject Code</label>
             <input type="text" class="form-control" name="subCode" id="subCode" max=5 value="${sub.subCode}" maxlength=5 required>
            </div>
            </div>
            
            <div class="col-12 col-sm-6">
            <div class="form-group">
                <label>Subject Name</label>
                <input type="text" class="form-control" name="subName" value="${sub.subName}" id="subName" required>
                </div>
                </div>
                
                <input type="hidden" class="form-control" name="hiddenValue" value="3"> 
                <input type="hidden" class="form-control" name="subID" value="${sub.subID}"> 
                </div>
                </div>
                
                <div class="modal-footer">
                
                <button type="Submit" class="btn btn-primary" data-dismiss="modal" onclick="return sendData('./subjects.php','update','subjects.php','subjects');">Update</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                </div>
                </form>
                </div>
                
                </div>
                </div>
                </div>`
                document.body.append(modalWrap);
                var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'),{backdrop:"static",keyboard:false});
                modal.show();
                
               }
   )
   
   
   //LoadClassSub
   function loadClassSub(response){
     let count=1;
     setTimeout(function(){
      $('#classSubInfo tfoot th').each(function (index) {
         if(index!=0 && index!=5){
        var title = $(this).text();
        $(this).html(`<input type="text" class=dt_search placeholder="Search `  + title + `" />`);
      }
   });
   var classSubInfo= $('#classSubInfo').DataTable({
      initComplete : function(){
         this.api().columns().every(function (index){
            let column = this;
            
            $('input', this.footer()).on('keyup change clear',function(){
               if(column.search !== this.value){
                  column.search(this.value).draw();
               }
            })
            
         })         
      },
      
      destroy : true,
      data :response,
      columns: [
         { "render": function(){ return count++;}}, 
         { data: 'subCode' },
         { data: 'subName'},
         { data: 'className'},
         { data: 'section'},
         { data: 'classSubID',
         render : function(data,type,row){
            return  `<div class="actions">
            <a href="#" class="btn btn-sm bg-danger-light" onclick="deleteRecord('classSubInfo.php',${data},'classSubInfo.php','classSub');">
            <i class="fas fa-trash"></i>
            </a>
            </div>`;
         }}                  
      ]   
   });
},100)
}

//Edit ClassSubInfo
// $(document).on('click','.editClassSub',function(){
   
//    var clsSub = JSON.parse($(this).attr("id"));;
//    getClass=false;getSubjects=false;
//    // getClass=0;
//    // getSubjects=0;
//    if(modalWrap!==null){
//       modalWrap.remove();
//    }
//    modalWrap=document.createElement('div');
//    modalWrap.innerHTML=`
//    <div class="modal fade" tabindex="-1" aria-hidden="true">
//    <div class="modal-dialog">
//    <div class="modal-content">
   
//    <div class="modal-header">
//    <h5 class="modal-title" id="staticBackdropLabel">Edit Class Subjects Info</h5>
//    <button type="button" class="btn-close btn btn-primary" data-dismiss="modal" aria-label="Close">X</button>
//    </div>
   
//    <form method="post">
//         <div class="modal-body">
        
//         <div class="row">
        
//         <div class="col-12 col-sm-6">
//         <div class="form-group">
//              <label>Class</label>
//              <select class="form-control" name="classID" id="getClass" onfocus="callFunction('./classes.php','getClass','2');" required>
//                                            <option selected value="${clsSub.classID}">${clsSub.className} ${clsSub.section}</option>
//              </select>
//              </div>
//              </div>

//         <div class="col-12 col-sm-6">
//             <div class="form-group">
//                 <label>Subjects</label>
//                 <select class="form-control" name="subID" id="getSubjects" onfocus="callFunction('./subjects.php','getSubjects','2');" required>
//                   <option selected value="${clsSub.subID}">${clsSub.subCode} ${clsSub.subName}</option>
//                   </select>
//                   </div>
//                   </div>
                  
//                   <input type="hidden" class="form-control" name="hiddenValue" value="3"> 
//                   <input type="hidden" class="form-control" name="classSubID" value="${clsSub.classSubID}"> 
//                   </div>
//                   </div>
                  
//                   <div class="modal-footer">
                  
//                   <button type="Submit" class="btn btn-primary" data-dismiss="modal" onclick="return sendData('./classSubInfo.php','update','classSubInfo.php','classSub');">Update</button>
//                   <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
//                   </div>
//                   </form>
//                   </div>
                  
//                   </div>
//                   </div>
//                   </div>`
//                   document.body.append(modalWrap);
//                   var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'),{backdrop:"static",keyboard:false});
//                   modal.show();
                  
//                }
//                )

              
               
               
               
               //LoadStudentsInfo
function loadStudents(response){

   setTimeout(function(){
                  $('#studentsInfo tfoot th').each(function (index) {
      if(index!=0 && index!=8){
         var title = $(this).text();
         $(this).html(`<input type="text" class=dt_search placeholder="Search `  + title + `" />`);
      }
   });
    let count=1;
   $('#studentsInfo').DataTable({
      initComplete : function(){
         
         this.api().columns().every(function (index){
            let column = this;
            
            $('input', this.footer()).on('keyup change clear',function(){
               if(column.search !== this.value){
                  column.search(this.value).draw();
               }
            })
            
         })          
      },
      destroy : true,
      data :response,
      columns: [
         { "render": function(){ return count++;}},                  
         { data: 'regNo' },
         { data: 'stuName'},
         { data: 'className'},
         { data: 'section'},
         { data: 'gender'},
         { data: 'fName'},
         { data: 'mName'},
         { data: 'stuID',
         render : function(data,type,row){
            
            return  `<div class="actions">
            <a href="#" id='${JSON.stringify(response[count-2])}' class="btn btn-sm bg-success-light mr-2 editStudent">
            <i class="fas fa-pen"></i>
            </a>
            <a href="#" class="btn btn-sm bg-danger-light" onclick="deleteRecord('students.php',${data},'students.php','students');">
            <i class="fas fa-trash"></i>
            </a>
            </div>`;
         }}                  
      ]   
          });
         })

         }


         //Edit Students
         $(document).on('click','.editStudent',function(){
   
            var stu = JSON.parse($(this).attr("id"));
            let gender = ["Male","Female","Others"];
            getClass = false;

            for(i in gender){
               if(gender[i]===stu.gender){
                  gender.splice(i,1);
               }
            }
            // getClass=0;
            // getSubjects=0;
            if(modalWrap!==null){
               modalWrap.remove();
            }
            modalWrap=document.createElement('div');
            modalWrap.innerHTML=`
            <div class="modal fade"  tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content">
            
            <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Edit Student</h5>
            <button type="button" class="btn-close btn btn-primary" data-dismiss="modal" aria-label="Close">X</button>
            </div>
            
            <form method="post">
                 <div class="modal-body">
                 
                 <div class="row">

                 <div class="col-12 col-sm-6">
                            <div class="form-group">
                               <label>Student Name</label>
                               <input type="text" class="form-control" name="stuName" value=${stu.stuName} required>
                            </div>
                         </div>

                         <div class="col-12 col-sm-6">
                         <div class="form-group">
                         <label>Student Id</label>
                         <input type="text" class="form-control" name="regNo" value=${stu.regNo} required>
                         </div>
                         </div>        
                      <div class="col-12 col-sm-6">
                         <div class="form-group">
                            <label>Gender</label>
                            <select class="form-control" name="gender"  id=getGender required>
                               <option selected value="${stu.gender}">${stu.gender}</option>
                               <option  value="${gender[0]}">${gender[0]}</option>
                               <option  value="${gender[1]}">${gender[1]}</option>
                            </select>
                         </div>
                      </div>

                      <div class="col-12 col-sm-6">
                        <div class="form-group">
                           <label>Class</label>
                           <select class="form-control" name="classID" id="getClass"  onfocus="callFunction('./classes.php','getClass','2');" required>
                               <option selected  value="${stu.classID}">${stu.className} ${stu.section}</option>
                               </select>
                         </div>
                     </div>
                  

                      
                     

                      <div class="col-12">
                         <h5 class="form-title"><span>Parent Information</span></h5>
                      </div>

                      <div class="col-12 col-sm-6">
                         <div class="form-group">
                            <label>Father's Name</label>
                            <input type="text" class="form-control" name="fName" value=${stu.fName} required>
                         </div>
                      </div>

                      <div class="col-12 col-sm-6">
                         <div class="form-group">
                            <label>Mother's Name</label>
                            <input type="text" class="form-control" name="mName"  value=${stu.mName} required>
                         </div>
                      </div>
                     
                 
                 
                           
                           <input type="hidden" class="form-control" name="hiddenValue" value="3"> 
                           <input type="hidden" class="form-control" name="stuID" value="${stu.stuID}"> 
                           </div>
                        </div>
                           
                           <div class="modal-footer">
                           
                           <button type="Submit" class="btn btn-primary" data-dismiss="modal" onclick="return sendData('./students.php','update','students.php','students');">Update</button>
                           <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                           </div>
                           </form>
                           </div>
                           
                           </div>
                           </div>
                           </div>`;
                           document.body.append(modalWrap);
                           var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'),{backdrop:"static",keyboard:false});
                           modal.show();
                           
                        }
                        )
         
         

         
         //LoadExamssInfo
         function loadExams(response){
            setTimeout(function(){
            $('#examsInfo tfoot th').each(function (index) {
               if(index!=0 && index!=2){
                  var title = $(this).text();
                  $(this).html(`<input type="text" class=dt_search placeholder="Search `  + title + `" />`);
               }
            });
   let count=1;
   $('#examsInfo').DataTable({
      initComplete : function(){
         
         this.api().columns().every(function (index){
            let column = this;
            
            $('input', this.footer()).on('keyup change clear',function(){
               if(column.search !== this.value){
                  column.search(this.value).draw();
               }
                 })
                 
               })          
      },
      destroy : true,
      data :response,
      columns: [
         { "render": function(){ return count++;}},                  
         { data: 'examName'},
         { data: 'examID',
         render : function(data,type,row){
                  
            return  `<div class="actions">
            <a href="#" id='${JSON.stringify(response[count-2])}' class="btn btn-sm bg-success-light mr-2 editExam">
            <i class="fas fa-pen"></i>
            </a>
            <a href="#" class="btn btn-sm bg-danger-light" onclick="deleteRecord('exams.php',${data},'exams.php','exams');">
            <i class="fas fa-trash"></i>
            </a>
            </div>`;
         }}                  
      ]   
   });
})
   
}

//Edit ExamName
$(document).on('click','.editExam',function(){
   var exam = JSON.parse($(this).attr("id"));
         if(modalWrap!==null){
            modalWrap.remove();
         }
          modalWrap=document.createElement('div');
          modalWrap.innerHTML=`
          <div class="modal fade" tabindex="-1"  aria-hidden="true">
   <div class="modal-dialog">
     <div class="modal-content">

       <div class="modal-header">
         <h5 class="modal-title" id="staticBackdropLabel">Edit Exam</h5>
         <button type="button" class="btn-close btn btn-primary" data-dismiss="modal" aria-label="Close">X</button>
       </div>
       
       <form method="post">
        <div class="modal-body">

         <div class="row">

          <div class="col-12 col-sm-6">
            <div class="form-group">
             <label>Class</label>
             <input type="text" class="form-control" name="examName" value="${exam.examName}" id="className">
            </div>
         </div>


          <input type="hidden" class="form-control" name="hiddenValue" value="3"> 
          <input type="hidden" class="form-control" name="examID" value="${exam.examID}"> 
         </div>
       </div>

      <div class="modal-footer">
       
         <button type="Submit" class="btn btn-primary" onclick="return sendData('./exams.php','update','exams.php','exams');" data-dismiss="modal">Update</button>
         <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
         </div>
       </form>
     </div>

   </div>
 </div>
   </div>`
       document.body.append(modalWrap);
       var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'),{backdrop: "static",keyboard:false});
       modal.show();
      
      }
   )


function loadClassExams(response,show=null){
   
setTimeout(function(){
   $('#classExamsInfo tfoot th').each(function (index) {
      if(index!=0 && index!=6){
         var title = $(this).text();
         $(this).html(`<input type="text" class=dt_search placeholder="Search `  + title + `" />`);
      }
   });
   let count=1;
   $('#classExamsInfo').DataTable({
      initComplete : function(){
         
         this.api().columns().every(function (index){
            let column = this;
            
            $('input', this.footer()).on('keyup change clear',function(){
               if(column.search !== this.value){
                  column.search(this.value).draw();
               }
            })
           
         })          
      },
      destroy : true,
      data :response,
      columns: [
         { "render": function(){ return count++;}},                  
         { data: 'examName'},
         { data: 'className'},
         { data: 'section'},
         { data: 'examStartDate',
         render : function(data){
            var dob=data;
            if(dob!=null){
               dob = showDate(dob);
            }
            return dob;
         }},{
            data : 'examEndDate',
            render : function(data){
               if(data!=null){
                  data=showDate(data);
               }
               return data;
            }
         },
         { data: 'examInfoID',
         render : function(data,type,row){
          if(show==null){  
            return  `<div class="actions">
            <a href="#" id='${JSON.stringify(response)}' class="btn btn-sm btn-outline-primary addMarks mr-2" onclick="loadHTML('add-marks.html','classSubExams.php','marks','2','${data}')">
            View
            </a>
            <a href="#" id='${JSON.stringify(response[count-2])}' class="btn btn-sm bg-success-light editClassExam mr-2">
            <i class="fas fa-pen"></i>
            </a>
            <a href="#" class="btn btn-sm bg-danger-light" onclick="deleteRecord('classExams.php',${data},'classExams.php','classExams');">
            <i class="fas fa-trash"></i>
            </a>
            </div>`;
         }else{
            return  `<div class="actions">
            <a href="#" id='${JSON.stringify(response)}' class="btn btn-sm btn-outline-primary examInfo mr-2" onclick="loadHTML('mark-list.html','marks.php','marksList','7','${data}')">
            View
            </a>
            </div>`;
         }
      } 
      }                 
      ]   
   });
},100);
   
}

$(document).on('click','.editClassExam',function(){
   var exam = JSON.parse($(this).attr("id"));
         if(modalWrap!==null){
            modalWrap.remove();
         }
          modalWrap=document.createElement('div');
          modalWrap.innerHTML=`
          <div class="modal fade" tabindex="-1"  aria-hidden="true">
   <div class="modal-dialog">
     <div class="modal-content">

       <div class="modal-header">
         <h5 class="modal-title" id="staticBackdropLabel">Edit ClassExams Info</h5>
         <button type="button" class="btn-close btn btn-primary" data-dismiss="modal" aria-label="Close">X</button>
       </div>
       
       <form method="post">
        <div class="modal-body">

         <div class="row">

      <div class="col-12 col-sm-6">
          <div class="form-group">
              <label>Exam</label> 
              <input type="text" readonly class="form-control" name="examName" value="${exam.examName}"  required>
          </div>
       </div>

       <div class="col-12 col-sm-6">
          <div class="form-group">
              <label> Start Date of Exam</label>
              <input type="date" class="form-control" name="examStartDate" value='${exam.examStartDate}' onfocus="dateCheck();" required>
          </div>
      </div>

       <div class="col-12 col-sm-6">
          <div class="form-group">
              <label>End Date of Exam</label>
              <input type="date" class="form-control" name="examEndDate" value='${exam.examEndDate}' min="${exam.examStartDate}"  onfocus="dateCheck();" required>
          </div>
      </div>

        <div class="col-12 col-sm-6">
            <div class="form-group">
             <label>Class</label>
             <input type="text" class="form-control" name="className" value="${exam.className} ${exam.section}" id="className" readonly>
            </div>
         </div>

          <input type="hidden" class="form-control" name="hiddenValue" value="3"> 
          <input type="hidden" class="form-control" name="examID" value="${exam.examID}"> 
          <input type="hidden" class="form-control" name="classID" value="${exam.classID}"> 
          <input type="hidden" class="form-control" name="examInfoID" value="${exam.examInfoID}"> 
         </div>
       </div>

      <div class="modal-footer">
      
         <button type="Submit" class="btn btn-primary" data-dismiss="modal" onclick="return sendData('./classExams.php','update','classExams.php','classExams');">Update</button>
         <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
         </div>
       </form>
     </div>

   </div>
 </div>
   </div>`
       document.body.append(modalWrap);
       var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'),{backdrop: "static",keyboard:false});
       modal.show();
      
   
})

//LoadMarks
function addMarks(response){
   
   // document.getElementById("back").innerHTML=`<button class="btn btn-primary" onclick="loadHTML('add-marks.html','classSubExams.php','marks','2','${cls.examInfoID}');">Back</button>`;
setTimeout(function(){
  let count=1;
   let c=-1;
   $('#addMarks').DataTable({
      destroy : true,
      data :response,
      columns: [
         { "render": function(){ return count++;}},                  
         { data: 'subCode'},
         { data: 'subName'},
         { data: 'maxMarks'},
         { data: 'minMarks'},
         { data: 'examSubInfoID',
         "render" : function(data,type,row){
          
          if(row.stat==0){
            //  console.log(response[c].stat);
             c++;
            return  `<div class="actions">
            <a href="#" id='${JSON.stringify(response[c])}' class="btn btn-sm btn-outline-info mr-2 addSubMarks" onclick='loadHTML("add-sub-marks.html","students.php","marksSub","5",${row.classID});'>
            Insert
            </a>
            <a href="#"  id='${JSON.stringify(response[c])}' class="btn btn-sm bg-success-light mr-2 editSubMarkInfo">
            <i class="fas fa-pen"></i>
            </a>
            <a href="#" class="btn btn-sm bg-danger-light" onclick="deleteRecord('classSubExams.php',${data},'classSubExams.php','marks','${row.examInfoID}');">
            <i class="fas fa-trash"></i>
            </a>
            </div>`;
         }else{
            c++;
            return `<div class="actions">
            <a href="#"  id='${JSON.stringify(response[c])}' class="btn btn-sm btn-outline-primary viewMarks" onclick='loadHTML("sub-marks.html","marks.php","viewMarks","2","${data}");'>
            View
            </a>
            <a href="#" class="btn btn-sm bg-danger-light" onclick="deleteRecord('classSubExams.php',${data},'classSubExams.php','marks','${row.examInfoID}');" >
            <i class="fas fa-trash"></i>
            </a>
            </div>`;
         }
      } 
      }                 
      ]   
   });
},200)   
}

//Editing SubMarks Info min and max Marks
$(document).on('click','.editSubMarkInfo',function(){
   var exam = JSON.parse($(this).attr("id"));
         if(modalWrap!==null){
            modalWrap.remove();
         }
          modalWrap=document.createElement('div');
          modalWrap.innerHTML=`
          <div class="modal fade" tabindex="-1"  aria-hidden="true">
   <div class="modal-dialog">
     <div class="modal-content">

       <div class="modal-header">
         <h5 class="modal-title" id="staticBackdropLabel">Edit Exam Subjects Info</h5>
         <button type="button" class="btn-close btn btn-primary" data-dismiss="modal" aria-label="Close">X</button>
       </div>
       
       <form method="post">
        <div class="modal-body">

         <div class="row">

      <div class="col-12 col-sm-6">
          <div class="form-group">
              <label>subject Code</label> 
              <input type="text" readonly class="form-control" name="subCode" value="${exam.subCode}"    required>
          </div>
       </div>

       <div class="col-12 col-sm-6">
          <div class="form-group">
              <label>Subject Name</label>
              <input type="text" class="form-control" name="subName" value='${exam.subName}' readonly required>
          </div>
      </div>

       <div class="col-12 col-sm-6">
          <div class="form-group">
              <label>Total Marks</label>
              <input type="text" class="form-control" name="maxMarks"id="maxMarks" value='${exam.maxMarks}' onfocus="isValid();" min=0 required>
          </div>
      </div>

        <div class="col-12 col-sm-6">
            <div class="form-group">
             <label>Minimum Marks</label>
             <input type="text" class="form-control" name="minMarks" id="minMarks" value="${exam.minMarks}" onfocus="isValid();" min=0 required>
            </div>
         </div>

          <input type="hidden" class="form-control" name="hiddenValue" value="3"> 
          <input type="hidden" class="form-control" name="examSubInfoID" value="${exam.examSubInfoID}"> 
         </div>
       </div>

      <div class="modal-footer">
       
         <button type="Submit" class="btn btn-primary" data-dismiss="modal"  onclick="return sendData('./classSubExams.php','update','classSubExams.php','marks',${exam.examInfoID});">Update</button>
         <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
         </div>
       </form>
     </div>

   </div>
 </div>
   </div>`
       document.body.append(modalWrap);
       var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'),{backdrop: "static",keyboard:false});
       modal.show();
      
   
})



//Adding marks to each student by Subjectwise
$(document).on('click','.addSubMarks',function(){
   let cls = JSON.parse($(this).attr("id"));
   setTimeout(function(){
   let count=1;
   document.getElementById('subName').innerText = cls.subName;
   let marksBody = document.getElementById('marksBody');
   let marks     ="";
   if(stu.length>0){
      for(let i in stu) {
   
      marks +=` <tr>
         <td>${count++}</td>
         <td>${stu[i].regNo}</td>
         <td>${stu[i].stuName}</td>
         <td>
         <input class=form-control type=number  min=0 max=${cls.maxMarks} name=obtMarks[${i}] required> 
         <input type=hidden class=form-control value=${stu[i].stuID} name=stuID[${i}] required>
         </td>
         </tr>
         `;
      }
    marks +=`<tr>
                <td colspan=3>
                   <button class="btn btn-primary" onclick="loadHTML('add-marks.html','classSubExams.php','marks','2','${cls.examInfoID}')"' 
                    >Back</button>  
                </td>
                <td colspan=1>
                <input type="hidden" class="form-control" name="examSubInfoID" value=${cls.examSubInfoID}>
                <input type="hidden" class="form-control" name="minMarks" value=${cls.minMarks}>
                <input type="hidden" class="form-control" name="stat" value=${cls.stat}>
                <input type="hidden" class="form-control" name="hiddenValue" value="1">
                <button type="submit" class="btn btn-primary float-right" 
                    id="submit" class=form-control>Submit</button>
              </td>
           </tr>`;
      marksBody.innerHTML=marks;
      //document.getElementById('submit').style.display='block';
   }else{
      marks +=`<tr>
      <td colspan=3>No Students Found</td>
      <td colspan=1>
         <button class="btn btn-primary" onclick="loadHTML('add-marks.html','classSubExams.php','marks','2','${cls.examInfoID}')"' 
          >Back</button>  
      </td>
      </tr>`;
         marksBody.innerHTML=marks;
   }
},100);

})
//Viewing Entered Marks By subject
$(document).on('click','.viewMarks',function(){
   let cls = JSON.parse($(this).attr("id"));
   setTimeout(function(){
   document.getElementById('subName').innerText = cls.subName;
   document.getElementById("back").innerHTML=`<button class="btn btn-primary" onclick="loadHTML('add-marks.html','classSubExams.php','marks','2','${cls.examInfoID}');">Back</button>`;
    viewMarksStu()
   },200);
})

function viewMarksStu(){
   setTimeout(function(){
      
      let count=1;
      
      $('#subMarks tfoot th').each(function (index) {
         if(index!=0 && index!=5){
            var title = $(this).text();
            $(this).html(`<input type="text" class=dt_search placeholder="Search `  + title + `" />`);
         }
      });
      let c=-1;
      
      $('#subMarks').DataTable({
         initComplete : function(){
            
            this.api().columns().every(function (index){
               let column = this;
               
               $('input', this.footer()).on('keyup change clear',function(){
                  if(column.search !== this.value){
                     column.search(this.value).draw();
                  }
               })
              
            })          
         },
         destroy : true,
         data :marks,
         columns: [
            { "render": function(){ return count++;}},                  
            { data: 'regNo'},
            { data: 'stuName'},
            { data: 'obtMarks'},
            { data: 'result'},
            { data: 'marksID',
             render : function(data,type,row){

                c++;
               return  `<div class="actions">
               <a href="#" id='${JSON.stringify(marks[c])}' class="btn btn-sm bg-success-light mr-2 editSubMarks">
               <i class="fas fa-pen"></i>
               </a> </div>`;
         } }                
         ]   
      });
    },100);
}
//Editing Marks Of Student
$(document).on('click','.editSubMarks',function(){
  
   var exam = JSON.parse($(this).attr("id"));
         if(modalWrap!==null){
            modalWrap.remove();
         }
          modalWrap=document.createElement('div');
          modalWrap.innerHTML=`
          <div class="modal fade" tabindex="-1"  aria-hidden="true">
   <div class="modal-dialog">
     <div class="modal-content">

       <div class="modal-header">
         <h5 class="modal-title" id="staticBackdropLabel">Edit Marks</h5>
         <button type="button" class="btn-close btn btn-primary" data-dismiss="modal" aria-label="Close">X</button>
       </div>
       
       <form method="post">
        <div class="modal-body">

         <div class="row">

      <div class="col-12 col-sm-6">
          <div class="form-group">
              <label>ID</label> 
              <input type="text" readonly class="form-control" name="subCode" value="${exam.stuID}"  required readonly>
          </div>
       </div>

       <div class="col-12 col-sm-6">
          <div class="form-group">
              <label>Student Name</label>
              <input type="text" class="form-control" name="subName" value='${exam.stuName}' readonly required>
          </div>
      </div>

       <div class="col-12 col-sm-6">
          <div class="form-group">
              <label>Obtained Marks</label>
              <input type="text" class="form-control" name="obtMarks" min=0 max=${exam.maxMarks} value='${exam.obtMarks}' min=0 required>
          </div>
      </div>

          <input type="hidden" class="form-control" name="hiddenValue" value="3"> 
          <input type="hidden" class="form-control" name="marksID" value="${exam.marksID}"> 
         </div>
       </div>

      <div class="modal-footer">
      
         <button type="Submit" class="btn btn-primary" data-dismiss="modal" onclick="return sendData('marks.php','update','marks.php','viewMarksStu',${exam.examSubInfoID});">Update</button>
         <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
         </div>
       </form>
     </div>

   </div>
 </div>
   </div>`
       document.body.append(modalWrap);
       var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'),{backdrop: "static",keyboard:false});
       modal.show();
         
})





//Load Entered Marks
let stuRes={};
let examInfo ={};
$(document).on('click','.examInfo',function(){
   let res= JSON.parse($(this).attr("id"));
   examInfo['examName'] = res[0].examName;
   examInfo['className'] = res[0].className;
   examInfo['section'] = res[0].section;
   examInfo['startDate'] = res[0].examStartDate;
   examInfo['endDate'] = res[0].examEndDate;
   examInfo['examInfoID'] = res[0].examInfoID;
   // console.log(res);
})

function enteredSubMarks(response){
   
   let data = JSON.parse(response);

setTimeout(function(){
   let count=1,sum=0,result,k;
   let tr='',trH='',sub=[],percentage=0,obtMarks=[],res=[],maxMarks=[],maxTotal=0;        
   for(let i in data[0]){
      sub[i] = data[0][i].subName;
      maxMarks[i] = data[0][i].maxMarks;
      maxTotal   += data[0][i].maxMarks;
      trH += `<th>${sub[i]}</th>`; 
   }
     
   document.querySelector("#subHead").outerHTML=trH;
   document.querySelector("#subFoot").outerHTML=trH;
   stuRes["subName"] = sub;
            for(let i in data[1]){
               sum=0,k=0;
               result="Pass";
               stuRes["regNo"] = data[1][i].regNo;
               stuRes["stuName"] = data[1][i].stuName;
               stuRes["fName"] = data[1][i].fName;
               stuRes["mName"] = data[1][i].mName;
               stuRes["dob"] = data[1][i].dob;
         tr +=` <tr>
                   <td>${count++}</td>
                   <td>${stuRes["regNo"]}</td>
                   <td>${stuRes["stuName"]}</td>`;
                for(let j in data[2]){
                  //   alert(data[2][j].stuID+" "+data[1][i].stuID);
                  if(data[2][j].stuID===data[1][i].stuID){
                        sum        += data[2][j].obtMarks;
                        obtMarks[k] = data[2][j].obtMarks;
                        res[k]      = data[2][j].result;
                        if(res[k]=='Fail')
                        result="Fail"; 
                        tr += `<td>${obtMarks[k]}</td>`;
                        k++;
                }
               }

               percentage = (sum/maxTotal)*100;
               stuRes["total"]=sum;
               stuRes["percentage"]=percentage;
               stuRes["result"]=res;
               stuRes["overAllResult"]=result;
               stuRes["obtMarks"]=obtMarks;
               stuRes["maxMarks"]=maxMarks;
               stuRes["maxTotal"]=maxTotal;

              //To Calculate Class
              stuRes["class"]="Fail";
              if(result!="Fail"){
               if(percentage>=85)
                 stuRes["class"]="Distinction";
               else if(percentage>=60)
                 stuRes["class"]="First Class";
               else if(percentage>=50)
                 stuRes["class"]="Second Class";
               else if(percentage>=35)
                 stuRes["class"]="Third Class";
              }


               printRes = JSON.stringify(stuRes);
         tr += `<td>${sum}</td>
                 <td>${percentage.toFixed(2)}%</td>
                 <td>${stuRes["class"]}</td>
                 <td>${result}</td>
                 <td><button id='${printRes}' class="btn btn-primary printRes" onclick="loadHTML('print-results.html');"
                 id="print">View</button></td>
                 </tr>`;         
               }
         document.querySelector("#marksList tbody").innerHTML=tr;
            var len= ($('#marksList tfoot th').length-1);
   $('#marksList tfoot th').each(function (index) {
      if(index!=0 && index!=len){
         var title = $(this).text();
         $(this).html(`<input type="text" class=dt_search placeholder="Search `  + title + `" />`);
      }
   });
   // count=1;
  var markList = $('#marksList').DataTable({
      initComplete: function () {
         // Apply the search
         this.api()
             .columns()
             .every(function () {
                 var that = this;

                 $('input', this.footer()).on('keyup change clear', function () {
                     if (that.search() !== this.value) {
                         that.search(this.value).draw();
                     }
                 });
             });
     },
 
      dom: 'lBfrtip',
      buttons: [ 
         {  extend : 'print',
            exportOptions: {
            columns: ':visible' 
           }
         },
         {
            extend : 'pdf',
            exportOptions : {
               columns :':visible'
            }
         },
         {
            extend : 'csv',
            exportOptions:{
               columns : ':visible'
            }
         },'colvis'        
      ]
   });
   markList.buttons().container()
   .insertBefore( '#markList_filter' );
},100)
   
}


$(document).on('click','.printRes',function(){
   let res= JSON.parse($(this).attr("id"));
   setTimeout(function(){
   let thead=document.getElementById("thead");
   let tbody=document.getElementById("tbody");
   let startDate = showDate(examInfo.startDate);
   let endDate = showDate(examInfo.endDate);
   let tr="";
   let percentage = res.percentage;
   // console.log(examInfo);
   let trH=`<tr>
               <td style="font-size:30px;" colspan=4 id="title"><b><center>Result</center></b></td>
             </tr>
              <tr>
                <td>Reg No :</td>
                <td>${res.regNo}</td>
                <td>Father's Name :</td>
                <td>${res.fName}</td>
            </tr>
            <tr>
                <td>Name :</td>
                <td>${res.stuName}</td>
                <td>Mother's Name :</td>
                <td>${res.mName}</td>
            </tr>
            <tr>
                <td>Class :</td>
                <td>${examInfo.className} ${examInfo.section}</td>
                <td>Exam :</td>
                <td>${examInfo.examName}</td>
            </tr>
            <tr>
                <td>Exam Start Date :</td>
                <td>${startDate}</td>
                <td>Exam End Date:</td>
                <td>${endDate}</td>
            </tr>
             <br>
            <tr>
               <td><b>Subject Name</b</td>
               <td><b>Max Marks</b></td>
               <td><b>Obtained Marks</b></td>
               <td><b>Result</b></td>
            </tr>`;

      for(i=0;i<res["subName"].length;i++){
          tr+=`<tr>
                 <td>${res.subName[i]}</td>
                 <td>${res.maxMarks[i]}</td>
                 <td>${res.obtMarks[i]}</td>
                 <td>${res.result[i]}</td>
               </tr>`
      }
      tr+=` <br><tr>
              <td><b>Total</b></td>
              <td><b>${res.maxTotal}</b></td>
              <td><b>${res.total}</b></td>
              <td><b>${res.overAllResult}</b></td>
            </tr>
            <br>
            <tr>
              <td><b>Percentage:</b></td>
              <td><b>${percentage.toFixed(2)}%</b></td>
              <td><b>Grade:</b></td>
              <td><b>${res.class}<b></td>
            </tr>`;
   
       
       thead.innerHTML=trH;     
       tbody.innerHTML=tr;  
       
},100)
   
})


let getClass=false,getSubjects=false,getExams=false;
//changeFunction
function callFunction(url,loadData,hiddenValue){
   if(!getClass && loadData=='getClass'){
      getClass=true;
      receiveData(url,loadData,hiddenValue);
  }
  else if(!getSubjects && loadData=='getSubjects'){
     getSubjects=true;
      receiveData(url,loadData,hiddenValue);
   }
   else if(!getExams && loadData=='getExams'){
      getExams=true;
      receiveData(url,loadData,hiddenValue);
   }
}

//changeFunction
function changeFunction(url,loadData,hiddenValue,id="getClass"){
   let value= document.getElementById(id).value;
   receiveData(url,loadData,hiddenValue,value);
}

//Delete Record
function deleteRecord(deleteURL,id,viewURL,loadData,viewID=null){
   if(modalWrap!==null){
      modalWrap.remove();
   }
    modalWrap=document.createElement('div');
    modalWrap.innerHTML=`
  <div class="modal fade" tabindex="-1">
   <div class="modal-dialog">
     <div class="modal-content">
       <div class="modal-header">
         <h5 class="modal-title">Delete</h5>
         <button type="button" class="btn-close btn btn-primary" data-dismiss="modal" aria-label="Close">X</button>
       </div>
       <div class="modal-body">
         Are You Sure Do You Want to Delete?  
       </div>
       <div class="modal-footer">
       <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="del('${deleteURL}','${id}','${viewURL}','${loadData}','${viewID}');">Delete</button>
         <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
         <div id="output"></div>
       </div>
     </div>
   </div>
 </div>
`;
document.body.append(modalWrap);
var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'),{backdrop: "static",keyboard:false});
modal.show();
   }

   //Delete Data
   function del(deleteURL,id,viewURL,loadData,viewID=null){
   
      $.ajax({
               url  : deleteURL,
               type : 'POST',
               data : {"id":id,"hiddenValue":"4"},
               success : function(response){
                  if(response.trim()=='true'){
                  document.getElementById("output").innerHTML=`<div class="alert alert-success" role="alert">
                  Record deleted Successfully...
                  </div>
                  `;
               }             
               else{
                  document.getElementById("output").innerHTML=`<div class="alert alert-warning" role="alert">
                  Record  Not Deleted Something Went Wrong...
                  </div>`;
               }
               $('#output').css({display:"block"});
                $('#output').fadeOut(1000);
            },
         })
         setTimeout(function(){
            receiveData(viewURL,loadData,"2",viewID);  
         },50);     
   }

   function dashboard(response){
     
      let count = JSON.parse(response);
     
      document.getElementById("countClasses").innerText=count[0].cls;
      document.getElementById("countSubjects").innerText=count[1].sub;
      document.getElementById("countStudents").innerText=count[2].stu;
      document.getElementById("countExams").innerText=count[3].exm;
   }

   function showDate(data){
      var date   = new Date(data);
      var year   = date.getFullYear();
      var month  = String(date.getMonth()+1).padStart(2,'0');
      var stuDob = String(date.getDate()).padStart(2,'0');
      return stuDob+"-"+month+"-"+year;
   }

   function dateCheck(){
      let endDate = document.getElementById("endDate");
      let startDate = document.getElementById("startDate");
   
       if(startDate.value!=null)
          endDate.setAttribute("min",startDate.value);
       if(endDate.value!=null)
          startDate.setAttribute("max",endDate.value);
   }

    function printF(){
      // document.getElementById("title").style.fontSize="30px";
      printJS({printable:'printResult',
          type: 'html',
         css : 'assets/css/newStyle.css',
         targetStyles: ['*']
         });
       
   }
   function Back(){
      loadHTML('mark-list.html','marks.php','marksList','7',examInfo.examInfoID);
   }

   
  
   