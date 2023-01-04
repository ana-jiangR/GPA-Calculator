// The MIT License (MIT)
// Copyright © 2022-2023 Yunhan Jiang (Ana)

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
// associated documentation files (the “Software”), to deal in the Software without restriction, including 
// without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
//copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the 
// following conditions:

// The above copyright notice and this permission notice shall be included in all copies or 
// substantial portions of the Software.

// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
// LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


const INVALID_SCORE = -100;
const VALID_SCORE_ZERO = 0;

// Standard = 'S',
// HonorMinus = 'H-',
// Honor = 'H',
// AdvancedHonor = 'AH',
// AP = 'AP'
const COURSE_LEVEL_ARRAY = ['S', 'H-', 'H', 'AH', 'AP'];

function validLevel(level) {
    let valid = false;
    for (let lvlstr of COURSE_LEVEL_ARRAY) {
        if (lvlstr === level) {
            valid = true;
            break;
        }
    }

    if (!valid) {
        console.error(level, "is not in the array COURSE_LEVEL_ARRAY", COURSE_LEVEL_ARRAY);
        return valid;
    }

    valid = false;

    // key in the object of COURSE_GPA_BY_LEVEL_AND_GRADE
    for (let lvlkey in COURSE_GPA_BY_LEVEL_AND_GRADE) {
        if (lvlkey === level) {
            valid = true;
            break;
        }
    }

    if (!valid) {
        console.error(level, "is not in the array COURSE_GPA_BY_LEVEL_AND_GRADE", COURSE_GPA_BY_LEVEL_AND_GRADE);
    }

    return valid;
}


// convert score to grade, e.g.,
// 97~100 -> A+; 0~69 -> F
const COURSE_GRADE_LOWBOUND_ARRAY = [ 97,   92,  87,  82,   77,  70,   65,  60,  0];
const COURSE_GRADE_ARRAY          = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C', 'D', 'F'];
const COURSE_GPA_BY_LEVEL_AND_GRADE = {
                                'S':  [4.0, 4.0, 3.7, 3.3, 3.0, 2.7, 2.0, 1.4, 0],
                                'H-': [4.3, 4.3, 4.0, 3.6, 3.3, 3.0, 2.3, 1.7, 0],
                                'H':  [4.5, 4.5, 4.2, 3.8, 3.5, 3.2, 2.5, 1.9, 0],
                                'AH': [4.7, 4.7, 4.4, 4.0, 3.7, 3.4, 2.7, 2.1, 0],
                                'AP': [5.0, 5.0, 4.7, 4.3, 4.0, 3.7, 3.0, 2.4, 0]
                            };

function validScore(score) {
    if (score === '' ||
        isNaN(Number(score)) === true ||
        Number(score) > 100 ||
        Number(score) < 0) {
        return false;
    } else {
        return true;
    }
}

// caller is responsible for making sure the score is in the range of [0,100],
// otherwise, caller needs to handle return of 'undefined" 
function getGradeIndexByScore(score) {

    if (!validScore(score))
        return undefined;

    // now we can make sure the score is in [0,100]
    let idx = -1;
    for (idx in COURSE_GRADE_LOWBOUND_ARRAY) {
        if (Number(score) >= COURSE_GRADE_LOWBOUND_ARRAY[idx])
            break;
    }

    return idx;
}

// caller is responsible for making sure the score is in the range of [0,100],
// otherwise, caller needs to handle return of 'undefined" or ''
function getGradeByScore(score) {
    if (!validScore(score))
        return '';

    // now we can make sure the score is in [0,100]
    let idx = getGradeIndexByScore(score);
    return COURSE_GRADE_ARRAY[idx];
}

// caller is responsible for making sure the score is in the range of [0,100],
// and the level is in the range of both COURSE_LEVEL_ARRAY and COURSE_GPA_BY_LEVEL_AND_GRADE.key
// otherwise, caller needs to handle return of 'undefined" or INVALID_SCORE
function getGPAByLevelAndScore(level, score) {
    if (!validScore(score))
        return INVALID_SCORE;

    if (!validLevel(level))
        return INVALID_SCORE;

    // now score is safely in [0,100]
    let gradeidx = getGradeIndexByScore(score);

    // and now the 'level' exists in the keys of COURSE_GPA_BY_LEVEL_AND_GRADE
    return COURSE_GPA_BY_LEVEL_AND_GRADE[level][gradeidx];
}


// 微信小程序开发之——WeUI快速上手
// https://pgzxc.github.io/posts/66aabbca.html

const DEFAULT_COURSE_INFO_DATA = {
    // input values
    Level: {
        name: 'Level',
        selected: 4,
    }, // selected is related to COURSE_LEVEL_ARRAY above.
    Weight: {
        name: 'Weight',
        value: INVALID_SCORE,
        isWaring: true,
        isClearBtn: false
    }, // range ???
    Term: {
        name: 'Term',
        value: VALID_SCORE_ZERO,
        isWaring: false,
        isClearBtn: true
    }, // 0 - 100
    Midterm: {
        name: 'Midterm',
        value: VALID_SCORE_ZERO,
        isWaring: false,
        isClearBtn: true
    }, // 0 - 100 
    Final: {
        name: 'Final',
        value: VALID_SCORE_ZERO,
        isWaring: false,
        isClearBtn: true
    }, // 0 - 100 

    // output (or caculated values)
    Overall: {
        name: 'Overall',
        value: INVALID_SCORE
    }, // 0 - 100 
    Grade: {
        name: 'Grade',
        value: ''
    }, // "A+/A/A-/B+..."
    GPA: {
        name: 'GPA',
        value: INVALID_SCORE
    }, // 0 - 100
};
const ALL_COURSES_ARRAY = ['Math', 'Language', 'Literature', 'AP1', 'AP2', 'Chinese', 'Elective', 'Optional'];

function getWeightedGPA(courseList){

  let weightSum = 0;
  let gpaScaleSum = 0;

  for (let entry of courseList)
  {
    // console.log(entry.entriesx.GPA.value);
    if(entry.entriesx.GPA.value != INVALID_SCORE)
    {
      // caution: string + string -> stringstring
      weightSum += Number(entry.entriesx.Weight.value);
      gpaScaleSum    += Number(entry.entriesx.GPA.value) * Number(entry.entriesx.Weight.value);
    }
  }

  // if sum === 0, means that there is no any available GAP score for all courses
  if (weightSum == 0)
    return INVALID_SCORE;
  else{
    // console.log(gpaScaleSum/weightSum, gpaScaleSum, weightSum);
    return gpaScaleSum/weightSum;
  }

}


Page({
    mixins: [require('../mixin/common')],



    data: {
        isInvalid: false,
        isDialogResetAll: false,
        weightedGPA: INVALID_SCORE,
        levelarray: COURSE_LEVEL_ARRAY,

        newCourseArray: [], // to be added (fill up with uniquename of courses during onLoad())
        existingCourseArray: [], // to be deleted (fill up with uniquename of courses during onLoad())

        list: [{
                uniquename: 'Math',
                expand: false,
                // pages: ['button', 'input', 'form'],
                pages: [],

                entriesx: DEFAULT_COURSE_INFO_DATA,
                iconpng: "images/icon_nav_Math.png",

            },

            {
                uniquename: 'Elective',
                expand: false,
                pages: [],

                entriesx: DEFAULT_COURSE_INFO_DATA,
                iconpng: 'images/icon_nav_Elective.png',

            },

            {
                uniquename: 'Chinese',
                expand: false,
                pages: [],

                entriesx: DEFAULT_COURSE_INFO_DATA,
                iconpng: 'images/icon_nav_Chinese.png',

            },

        ],
    },
    kindToggle(e) {

        const {
            id
        } = e.currentTarget;
        const {
            list
        } = this.data;

        // convert id to number/index
        let index = Number(id);

        // console.log("id:%o, index:%o, name:%o", id, index, list[index].name);

        list[index].expand = !list[index].expand;


        // 一次只能展开一个。。。
        for (let i = 0, len = list.length; i < len; ++i) {
            if (index != i) {
                list[i].expand = false;
            }
        }

        this.setData({
            list,
        });

        // console.log(list);

    },


    bindPickerLevelChange(e) {
        const {
            id
        } = e.currentTarget;
        const {
            list
        } = this.data;
        let index = Number(id);

        // console.log("bindPickerLevelChange:index:%o, name:%o, selected:%o", index, list[index].name, e.detail.value);

        // update selected value for this picker operation
        list[index].entriesx.Level.selected = e.detail.value;

        this.setData({
            list,
        });
    },



    // a function which handles event for input of names (Weight/Term/Midterm/Final)
    // based on id = "id.name"
    onInput(evt) {

        let {
            list,
            weightedGPA
        } = this.data;
        const {
            id
        } = evt.currentTarget;
        const {
            value
        } = evt.detail;

        // id = "id.name", so split it with (id) and (name)
        const strArray = id.split(".");
        let index = Number(strArray[0]);
        let iname = strArray[1];

        // console.log(evt);
        // console.log("onInput: index:%o, name:%o, inputvalue:%o, inputname:%s", index, list[index].uniquename, value, iname);

        // valid input range (min, max]
        let max;
        let min = 0;
        if (iname === 'Weight') {
            max = 5;
        } else {
            max = 100;
        }

        // invalid data if input is out of the range (min, max]
        let invalid = false;
        if (isNaN(Number(value)) == true || Number(value) > max || (iname === 'Weight' ? Number(value) <= min : Number(value) < min) || value === ''){
            invalid = true;
        }

        if (iname === 'Term' || iname === 'Weight' || iname === 'Midterm' || iname === 'Final') {
            // update the value input
            list[index].entriesx[iname].value = value;

            // is input value invalid? if yes, show warning.
            list[index].entriesx[iname].isWaring = invalid;


            // if input length > 0, then display icon:weui-icon-clear to clear it.
            let isClear = false;
            if (value.length > 0) {
                isClear = true;
            }
            list[index].entriesx[iname].isClearBtn = isClear;


            // also clear these below
            list[index].entriesx.Overall.value = INVALID_SCORE;
            list[index].entriesx.Grade.value = '';
            list[index].entriesx.GPA.value = INVALID_SCORE;

            // since this course's GPA is cleared, so update the total weighted GPA too.
            weightedGPA = getWeightedGPA(this.data.list);

            // console.log("onInput: %o", list[index].entriesx[iname].value);

            this.setData({
                [list[index].entriesx[iname].value]: value,
                [list[index].entriesx[iname].isWaring]: invalid,
                [list[index].entriesx[iname].isClearBtn]: isClear,
                list,
                weightedGPA: weightedGPA.toFixed(3),
            });
        }
    },

    // a function which handles event for  clear of names (Weight/Term/Midterm/Final)
    // based on id = "id.name"
    onClear(e) {

        let {
            list,
            weightedGPA
        } = this.data;

        const {
            id
        } = e.currentTarget;

        // id = "id.name", so split it with (id) and (name)
        const strArray = id.split(".");
        let index = Number(strArray[0]);
        let iname = strArray[1];

        // console.log(evt);
        // console.log("onClear: index:%o, name:%o, inputname:%s", index, list[index].name, iname);

        if (iname === 'Term' || iname === 'Weight' || iname === 'Midterm' || iname === 'Final') {

            list[index].entriesx[iname].value = INVALID_SCORE;
            list[index].entriesx[iname].isClearBtn = false;
            list[index].entriesx[iname].isWaring = true;

            // also clear these below
            list[index].entriesx.Overall.value = INVALID_SCORE;
            list[index].entriesx.Grade.value = '';
            list[index].entriesx.GPA.value = INVALID_SCORE;

            // since this course's GPA is cleared, so update the total weighted GPA too.
            weightedGPA = getWeightedGPA(this.data.list);

            this.setData({
                // [list[index].entriesx[iname].value]: INVALID_SCORE, FIXMED - Weird, doesn't work????
                list,
                weightedGPA: weightedGPA.toFixed(3),
            });

        }
    },



    changeTheme() {
        // console.log(this.data);
        getApp().themeChanged(this.data.theme === 'light' ? 'dark' : 'light');
    },

    // 检查错误，或者计算结果
    onConfirm(e) {
        let {
            list,
            isInvalid,
            levelarray,
            weightedGPA,
        } = this.data;

        const {
            id
        } = e.currentTarget;
        let index = Number(id);

        // console.log("onConfirm: id:%o, name:%o", id, list[index].uniquename);


        let LevelValue = list[index].entriesx.Level.selected;
        let isLevelValid = (LevelValue >= 0 && LevelValue < levelarray.length) ? true : false;

        // 检查是否有非法的输入数值（scores）
        let isWaring = !isLevelValid ||
            list[index].entriesx.Weight.isWaring ||
            list[index].entriesx.Term.isWaring ||
            list[index].entriesx.Midterm.isWaring ||
            list[index].entriesx.Final.isWaring;

        isInvalid = isWaring;


        if (isInvalid) {
            // so, the input(s) is invalid, then clear the overall/grade/gpa values (to default)
            list[index].entriesx.Overall.value = INVALID_SCORE;
            list[index].entriesx.Grade.value = '';
            list[index].entriesx.GPA.value = INVALID_SCORE;

        } else {
            // WIP:
            let levelstr = levelarray[LevelValue];

            let term = Number(list[index].entriesx.Term.value),
                midTerm = Number(list[index].entriesx.Midterm.value),
                final   = Number(list[index].entriesx.Final.value);    
            // weighted score [0 ... 100]                
            let wscore = 0.3 * term +
                         0.3 * midTerm +
                         0.4 * final;  
                // [0,1,2,3]
            let wcred  = (term    === 0? 0:0.3) + 
                         (midTerm === 0? 0:0.3) +
                         (final   === 0? 0:0.4);
            
            let overallScore = (wcred === 0) ? INVALID_SCORE: wscore/wcred;

            // console.log(wscore, wcred, term, midTerm, final, 
            //   overallScore, 
            //   getGradeByScore(overallScore),
            //   getGPAByLevelAndScore(levelstr, overallScore));

            // Warn: toFixed() is a string, rather than a Number
            list[index].entriesx.Overall.value = overallScore.toFixed(2);  
            list[index].entriesx.Grade.value = getGradeByScore(overallScore);
            list[index].entriesx.GPA.value = getGPAByLevelAndScore(levelstr, overallScore).toFixed(1);

            wx.showToast({
                title: 'Success',
                icon: 'success',
                duration: 1000
            });
        }

        // update this.data.weightedGPA
        weightedGPA = getWeightedGPA(this.data.list);

        this.setData({
            list,
            weightedGPA: weightedGPA.toFixed(3),
            isInvalid: isWaring
        });

        // only display the error message (top tip) for 3s when invlid == true
        if (isInvalid == true) {
            isInvalid = false;
            setTimeout(() => {
                this.setData({
                    isInvalid: false,
                });
            }, 5000);
        }
    },


    onReset(e) {

        let {
            list,
            weightedGPA,
        } = this.data;
        const {
            id
        } = e.currentTarget;
        let index = Number(id);

        // console.log("onReset: id:%o, name:%o", id, list[index].uniquename);

        // get current Object Entries.
        let listEntryObj = list[index].entriesx;
        for (let key in listEntryObj) {
            if (listEntryObj.hasOwnProperty(key)) {

                // console.log(listEntryObj[key]);

                if (key === 'Level')
                    listEntryObj[key].selected = -1; // invalid -> empty in picker selection

                if (key === 'Weight') {
                    listEntryObj[key].value = INVALID_SCORE;
                    listEntryObj[key].isWaring = true;
                    listEntryObj[key].isClearBtn = false;
                }

                if (key === 'Term' || key === 'Midterm' || key === 'Final') {
                    listEntryObj[key].value = VALID_SCORE_ZERO;
                    listEntryObj[key].isWaring = false;
                    listEntryObj[key].isClearBtn = true;
                }

                if (key === 'Overall' || key === 'GPA') {
                    listEntryObj[key].value = INVALID_SCORE;
                }

                if (key === 'Grade') {
                    listEntryObj[key].value = '';
                }

                // console.log(listEntryObj[key]);

            }
        }

        // update this.data.weightedGPA
        weightedGPA = getWeightedGPA(this.data.list);
        
        // console.log(list[index].entriesx);

        this.setData({
            weightedGPA: weightedGPA.toFixed(3),
            list,
        });

        wx.showToast({
            title: 'Done',
            icon: 'success',
            duration: 700
        });
    },

    onResetAll() {

        // promote a dialog
        this.setData({
            isDialogResetAll: true
        });
    },

    onResetAllYes() {

        const {
            list,
        } = this.data;

        // console.log("onResetAllYes: list:%o", list);

        // clear all the entry values (to default) in the list for each suject and all entries in that course
        for (let course of list) {
            // console.log("onResetAllYes: course:%o", course);

            let entries = course.entriesx;

            for (let key in entries) {
                if (entries.hasOwnProperty(key)) {

                    if (key === 'Level')
                        entries[key].selected = -1; // invalid -> empty in picker selection

                    if (key === 'Weight') {
                        entries[key].value = INVALID_SCORE;
                        entries[key].isWaring = true;
                        entries[key].isClearBtn = false;
                    }

                    if (key === 'Term' || key === 'Midterm' || key === 'Final') {
                        entries[key].value = VALID_SCORE_ZERO;
                        entries[key].isWaring = false;
                        entries[key].isClearBtn = true;
                    }

                    if (key === 'Overall' || key === 'GPA') {
                        entries[key].value = INVALID_SCORE;
                    }

                    if (key === 'Grade') {
                        entries[key].value = '';
                    }

                    // console.log(entries[key]);

                }
            }
        }


        this.data.weightedGPA = INVALID_SCORE;

        // suppress this dialog
        this.setData({
            isDialogResetAll: false,
            isInvalid: false,
            list,
            weightedGPA: this.data.weightedGPA
        });
    },

    onResetAllNo() {

        // suppress this dialog
        this.setData({
            isDialogResetAll: false
        });
    },




    onLoad() {
        let {
            newCourseArray,
            existingCourseArray,
            list
        } = this.data;

        if (newCourseArray.length === 0 && existingCourseArray.length === 0) {
            // console.log("onLoad: update course arraries: newCourseArray/existingCourseArray");

            for (let course of ALL_COURSES_ARRAY) {
                let isExist = false;
                for (let entry of list) {
                    if (course === entry.uniquename) {
                        isExist = true;
                        break;
                    }
                }

                if (isExist) {
                    // exist? then append it to existingCourseArray
                    existingCourseArray = existingCourseArray.concat(course);
                } else {
                    // if not exist (not in default), then append it to newCourseArray
                    newCourseArray = newCourseArray.concat(course);
                }
            }
        }

        console.log("onLoad:  existingCourse:%O, newCourse:%O", existingCourseArray, newCourseArray);


        this.setData({
            newCourseArray: newCourseArray,
            existingCourseArray: existingCourseArray,
        })

    },

    bindPickerAddCourse(evt) {


        let index = evt.detail.value;

        let {
            newCourseArray,
            existingCourseArray
        } = this.data;

        let coursename = newCourseArray[index];

        if (coursename === undefined) {
            // if newCourseArray is empty now, then do nothing
            return;
        }


        // console.log("bindPickerAddCourse:selected course:%o", coursename);

        // TODO: 确保course name是唯一的（没有重复）    

        // make a copy (DEEP COPY), otherwise, all the new added courses share the same data/memory
        // https://wp.prodevhub.com/deep-copy-objects-in-javascript/
        let deepCopyData = JSON.parse(JSON.stringify(DEFAULT_COURSE_INFO_DATA));

        let newcourse = {
            uniquename: coursename,
            pages: [],
            expand: false,
            entriesx: deepCopyData,
            iconpng: 'images/icon_nav_' + coursename + '.png'
        };

        this.data.list = this.data.list.concat([newcourse]);

        // delete this selected course from newCourseArray 
        newCourseArray.splice(index, 1);

        // add this course to existingCourseArray
        existingCourseArray.push(coursename);



        this.setData({
            list: this.data.list,
            newCourseArray: newCourseArray,
            existingCourseArray: existingCourseArray,

        })

    },


    bindPickerDelCourse(evt) {


        let index = evt.detail.value;

        let {
            newCourseArray,
            existingCourseArray,
            list,
            weightedGPA,
        } = this.data;

        let coursename = existingCourseArray[index];

        if (coursename === undefined) {
            // if newCourseArray is empty now, then do nothing
            return;
        }

        // console.log("bindPickerDelCourse:selected course:%o", coursename);

        let foundFlag = false;
        let entryIdx = 0;
        // loop the list to find this course
        for (let entry of list) {
            if (coursename === entry.uniquename) {

                // if found, then remove this entry from this list
                list.splice(entryIdx, 1);

                foundFlag = true;
                break;
            }
            entryIdx++;
        }

        if (!foundFlag) {
            // do nothing
            return;
        }

        // delete this course from existingCourseArray
        existingCourseArray.splice(index, 1);

        // add this selected course to newCourseArray 
        newCourseArray.push(coursename);

        // console.log(newCourseArray);
        // console.log(existingCourseArray);


        // update this.data.weightedGPA since since this course's data is cleared
        // TODO: 优化方法 - 如果删除的课程的GPA值是无效的(INVALID_SCORE), 则没有必要更新 weightedGPA
        weightedGPA = getWeightedGPA(this.data.list);


        this.setData({
            list: this.data.list,
            newCourseArray: newCourseArray,
            existingCourseArray: existingCourseArray,
            weightedGPA: weightedGPA.toFixed(3),
        })

    },

    //  转发分享
    onShareAppMessage() {
        return {
          title: 'SSBS|GPA计算',
          //path: 'pages/home/index',
          imageUrl: 'images/logo_gold.png'
        }
      },

    // 转发朋友圈
    onShareTimeline(){
        return {
            title:'SSBS|GPA计算器',
            imageUrl: 'images/logo_gold.png'
        }
    },
});