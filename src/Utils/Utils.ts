import * as SecureStore from 'expo-secure-store';
import {AsyncStorage } from "react-native";
import moment, { isMoment } from "moment";
import fetch from './fetchWithTimeout'
async function authUser(username, password) {
    try {
        await fetch("https://openid.sfedu.ru/server.php/logout", {}, 3000);
        var bodyFormData = new FormData();

        //Заполняем bodyFormData,добавляя логин и пароль
        bodyFormData.append('openid_url', username);
        bodyFormData.append('password', password);
        var answ = undefined
        //Делаем запрос в единому сервису авторизации
        await fetch("https://openid.sfedu.ru/server.php/login", {
            method: "POST",
            credentials: "same-origin",
            body: bodyFormData,
            redirect: "follow",
        }, 3000)
            .then(response => {
                return response.text();
            })
            .then(response => {
                answ = response
            })
            .catch(error => {
                throw "Err"
            });
        return answ
    } catch (err) {
        throw "Err"
    }
};

async function getScheduleUtils(username) {
    try {
        var type = "", course = 0, group = 0;
        await fetch("http://grade.sfedu.ru/handler/sign/openidlogin?loginopenid=" + username, {
            method: "GET",
            credentials: "same-origin",
        })
            .then(response => response.text())
            .then(response => {
                var pos = response.indexOf('Курс, группа:</div><div class="content">')
                var pos2 = response.indexOf('</div></div><div class="clearFix"><div class="label">Тип аккаунта:</div>')
                var parsed = (response.substr(pos + 40, pos2 - pos - 40)).split(", ")
                //console.log(parsed)
                switch (parsed[0]) {
                    case "Бакалавриат":
                        type = 'bachelor'
                        break;
                    case "Магистратура":
                        type = 'master'
                        break;
                    case "Аспирантура":
                        type = 'postgraduate'
                        break;
                    default:
                        type = 'bachelor'
                }
                course = Number(parsed[1][0])
                group = Number(parsed[2][0])
            })
            .catch(error => {
                console.log(error);
            });

        var resp = "", courseList = "";
        await fetch("http://schedule.sfedu.ru/APIv1/grade/list", {
            method: "GET",
            credentials: "same-origin",
        })
            .then(response => response.text())
            .then(response => {
                resp = response
            })
            .catch(error => {
                console.log(error);
            });

        var listPerCourses = JSON.parse(resp)
        listPerCourses.map((item) => {
            if (item.num == course && item.degree == type) {
                courseList = item.id
            }
        })
        var resp2 = "", ids = "";
        await fetch("http://schedule.sfedu.ru/APIv1/group/forGrade/" + courseList, {
            method: "GET",
            credentials: "same-origin",
        })
            .then(response => response.text())
            .then(response => {
                ids = JSON.parse(response)
                ids.map(item => {
                    if (item.num == group) {
                        ids = item.id
                    }
                })
                resp2 = response
            })
            .catch(error => {
                console.log(error);
            });

        var schedule = ""
        //!!!!!!!!!!!!!
        // + ids
        //!!!!!!!!!!!!!
        //console.log(ids)
        await fetch("http://schedule.sfedu.ru/APIv1/schedule/group/" + ids, {
            method: "GET"
        }
        )
            .then(response => response.text())
            .then(response => {
                schedule = JSON.parse(response)
                schedule.lessons.map((item) => {
                    item.times = item.timeslot.substr(1, item.timeslot.length - 2).split(",");
                    item.timeslot = item.timeslot.substr(1, item.timeslot.length - 2).split(",").map((i, index) => { return index != 3 ? Number(i.replace(/:/g, "")) : i })
                })
                schedule.lessons.sort((a, b) => {
                    let aval = (a.timeslot[0] + 1) * 1000000 + a.timeslot[1] + (a.timeslot[3] == "low" ? 0.5 : 0)
                    let bval = (b.timeslot[0] + 1) * 1000000 + b.timeslot[1] + (b.timeslot[3] == "low" ? 0.5 : 0)
                    if (aval < bval) {
                        return -1;
                    }
                    if (aval > bval) {
                        return 1;
                    }
                    return 0;
                })
            })

    } catch (e) {
        throw "Err"
    }
    return schedule;
}

async function parseMarks(page) {
    var rez = ''
    let re = /Текущая сумма баллов по дисциплине">\d*</gm;
    let m;

    while ((m = re.exec(page)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            rez += match.substr(match.indexOf('>') + 1, match.indexOf('<') - match.indexOf('>') - 1)
        });
    }
    return rez
}

async function getMarks(username, password) {
    await authUser(username, password)
    var res = '';
    var resp = '';
    var pos = -1;
    await fetch("http://grade.sfedu.ru/handler/sign/openidlogin?loginopenid=Chamkin", {
        method: "POST",
        credentials: "same-origin",
        redirect: "follow",
    })
        .then(response => response.text())
        .then(response => {
            pos = response.indexOf('Курс, группа:</div><div class="content">')

            if (pos != -1) {
                resp = response
            }

        })
        .catch(error => {
            console.log(error);
        });
    if (pos == -1) {
        console.log("bad data!")
        throw "Err"
    }
    res = await parseMarks(resp)
    return res;
}

async function getTypeOfWeek() {
    var week = undefined
    try {
        week = await fetch('http://schedule.sfedu.ru/APIv1/week', {}, 800).then(response => response.json())
        if (week.week == 1) {
            await SecureStore.setItemAsync("week", moment().week().toString())
        } else {
            await SecureStore.setItemAsync("week", (moment().week() - 1).toString())
        }
        return week.week
    } catch (e) {
        console.log("Bad internet")
        var cachedWeek = await SecureStore.getItemAsync("week")
        if (cachedWeek == moment().week()) return 1
        if (cachedWeek != undefined) {
            return ((moment().week() - cachedWeek) + 1) % 2
        } else {
            return -1
        }
    }
}

async function refreshSchedule() {
    var username = await SecureStore.getItemAsync("username")
    var password = await SecureStore.getItemAsync("password")
    try {
        var resp = await authUser(username, password)
        if (!resp.includes("Вы вошли как")) {
            return "BadLogin"
        }
        var s = await getScheduleUtils(username)
        await AsyncStorage.setItem("timetable", JSON.stringify(s));
        global.s = s;
        return "Ok";

    } catch (err) {
        throw "Err";
    }
}
export { authUser, getScheduleUtils, getMarks, getTypeOfWeek, refreshSchedule };