var request = require('request');

module.exports = function (controller) {

  var state = {};

  function startConv(bot, message) {
    if (!message.location) {
      bot.say({ text: 'Please enable location on you device and the refresh the page' });
    } else {
      state.loc = message.location
      bot.startConversation(message, function (err, convo) {
        convo.ask(
          {
            text: '👋 Hi I\'m Emi and I\'m here to help you find the fastest way to get treatment. Just say <span>HELP ME</span> to get started.',
            quick_replies: [
              {
                title: 'HELP ME',
                payload: 'HELP ME',
              },
            ]
          })
      });
    }
  }

  controller.hears(['help'], 'message_received', function (bot, message) {
    bot.reply(message, {
      text: 'Ok - I just need to ask you a few questions to provide a recommendation. Have you suffered an<span> INJURY</span>, are you <span>FEELING ILL</span>, or are you having <span>TROUBLE BREATHING</span>?',
      quick_replies: [
        {
          title: 'INJURY',
          payload: 'INJURY',
        },
        {
          title: 'FEELING ILL',
          payload: 'FEELING ILL',
        },
        {
          title: 'TROUBLE BREATHING',
          payload: 'TROUBLE BREATHING',
        },
      ]
    }, function (bot, message) {
      request({ url: 'https://luckyshot-api-prod.herokuapp.com/hospital/closest?lat=' + state.loc.lat + '&lng=' + state.loc.lon },
        function (err, response, data) {
          var parsedData = null;
          try {
            parsedData = JSON.parse(data)
          } catch (e) { }
          if (err || !parsedData) {
            state.hos = { error: true, data: [], closest: {} }
          } else {
            state.hos = { error: false, data: parsedData, closest: parsedData[0] };
          }
        })
    })
  });


  controller.hears(['TROUBLE BREATHING', 'feeling ill', 'burn'], 'message_received', function (bot, message) {
    bot.say({
      text: 'I\'m really sorry, I\'m new and still learning about these types of emergencies. Please consult your local GP office, or call 000 if you think it may have a serious emergency. </br>' +
        'Tap:  <span style="text-decoration:underline;" onclick=(function(){location.reload()})()> START OVER</span>'
    });
  });


  controller.hears(['injury'], 'message_received', function (bot, message) {
    bot.reply(message, {
      text: 'Ok — what is the nature of your injury? Is it a <span>CUT</span>, is it a <span>BURN</span> or do you think you might have a <span>BROKEN BONE</span>?',
      quick_replies: [
        {
          title: 'CUT',
          payload: 'CUT',
        },
        {
          title: 'BURN',
          payload: 'BURN',
        },
        {
          title: 'BROKEN BONE',
          payload: 'BROKEN BONE',
        },
      ]
    }, function () { })
  });

  controller.hears(['broken bone', 'cut'], 'message_received', function (bot, message) {
    state.injury_type = message.match[0];
    bot.reply(message, {
      text: 'What part of your body have you injured?',
      quick_replies: [
        {
          title: 'HEAD',
          payload: 'HEAD',
        },
        {
          title: 'ARM',
          payload: 'ARM',
        },
        {
          title: 'LEG',
          payload: 'LEG',
        },
        {
          title: 'BACK',
          payload: 'BACK',
        },
        {
          title: 'CHEST',
          payload: 'CHEST',
        },
        {
          title: 'NECK',
          payload: 'NECK',
        },
        {
          title: 'HAND',
          payload: 'HAND',
        },
        {
          title: 'FOOT',
          payload: 'FOOT',
        },
      ]
    }, function () { })
  });



  controller.hears(['head', 'neck', 'back'], 'message_received', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
      convo.addMessage({
        text: 'You may require urgent medical attention. Please <strong><strong>dial 000</strong></strong> and speak to an emergency operator.',
      }, 'default');
      convo.addMessage({
        text: 'Do you need any further assistance? Just say <span>HELP ME</span> to start again.',
      }, 'default');
    });
  });

  controller.hears(['leg', 'arm', 'hand', 'foot', 'chest'], 'message_received', function (bot, message) {
    if (state.injury_type === 'CUT') {
      bot.startConversation(message, function (err, convo) {
        convo.ask({
          text: 'Are you still bleeding from the injury?',
          quick_replies: [
            {
              title: 'YES',
              payload: 'YES',
            },
            {
              title: 'NO',
              payload: 'NO',
            }
          ]
        },
          [
            {
              pattern: 'yes',
              callback: function (res, convo) {
                convo.gotoThread('still_bleeding');
                convo.next();
              }
            },
            {
              pattern: 'no',
              callback: function (res, convo) {
                convo.gotoThread('not_still_bleeding');
                convo.next();
              }
            },
          ]);

        convo.addQuestion({
          text: 'Are you able to stop the bleeding by holding a bandage or dressing over the wound?',
          quick_replies: [
            {
              title: 'YES',
              payload: 'YES',
            },
            {
              title: 'NO',
              payload: 'NO',
            }
          ]
        }, [
            {
              pattern: 'yes',
              callback: function (response, convo) {
                convo.gotoThread('pain');
                convo.next();
              }
            },
            {
              pattern: 'no',
              callback: function (response, convo) {
                convo.gotoThread('pain');
                convo.next();
              }
            },
            {
              default: true,
              callback: function (response, convo) {
                convo.repeat();
                convo.next();
              }
            }
          ], {}, 'still_bleeding');

        convo.addQuestion({
          text: 'Does the wound have dirt or other material in it?',
          quick_replies: [
            {
              title: 'YES',
              payload: 'YES',
            },
            {
              title: 'NO',
              payload: 'NO',
            }
          ]
        }, [
            {
              pattern: 'yes',
              callback: function (response, convo) {
                convo.gotoThread('pain');
                convo.next();
              }
            },
            {
              pattern: 'no',
              callback: function (response, convo) {
                convo.gotoThread('pain');
                convo.next();
              }
            },
            {
              default: true,
              callback: function (response, convo) {
                convo.repeat();
                convo.next();
              }
            }
          ], {}, 'not_still_bleeding');


        convo.addQuestion({
          text: 'How much pain are you experiencing now?',
          quick_replies: [
            {
              title: '<div style="font-size:24px;">😐</div>',
              payload: '😐',
            },
            {
              title: '<div style="font-size:24px;">😕</div>',
              payload: '😕',
            },
            {
              title: '<div style="font-size:24px;">☹️</div>',
              payload: '☹️',
            },
            {
              title: '<div style="font-size:24px;">😩</div>',
              payload: '😩',
            },
            {
              title: '<div style="font-size:24px;">😖</div>',
              payload: '😖',
            },
          ]
        }, [
            {
              pattern: '😐',
              callback: function (response, convo) {
                convo.gotoThread('recommendation');
                convo.next();
              }
            },
            {
              pattern: '😕',
              callback: function (response, convo) {
                convo.gotoThread('recommendation');
                convo.next();
              }
            },
            {
              pattern: '☹️',
              callback: function (response, convo) {
                convo.gotoThread('recommendation');
                convo.next();
              }
            },
            {
              pattern: '😩',
              callback: function (response, convo) {
                convo.gotoThread('recommendation_bad');
                convo.next();
              }
            },
            {
              pattern: '😖',
              callback: function (response, convo) {
                convo.gotoThread('recommendation_bad');
                convo.next();
              }
            },
            {
              default: true,
              callback: function (response, convo) {
                convo.repeat();
                convo.next();
              }
            }
          ], {}, 'pain');

        convo.addMessage({
          text: 'You should try and get to an emergency department. I\'m going to help you find one that is likely to get you treated in the least amount of time.',
        }, 'recommendation');

        convo.addMessage({
          text: 'You may require urgent medical attention. Please <strong><strong>dial 000</strong></strong> and speak to an emergency operator.',
        }, 'recommendation_bad');

        var recommendationText = 'I recommend this hospital: <strong>' + state.hos.closest.name + '</strong>' +
          '. <br/> It is <strong>' + state.hos.closest.direction.distance.text + '</strong> from here.' +
          'The average wait time for your condition is <strong>' + state.hos.closest.direction.duration.text + ' </strong>. </br>' +
          'There are currently <strong>' + state.hos.closest.waitCount.toString() + ' people</strong> in the waiting room. </br> ' +
          'If I order an Uber now, I estimate that you will be treated within <strong>' + state.hos.closest.waitingTime.text + '</strong>.';
        convo.addMessage({
          text: recommendationText,
        }, 'recommendation');

        convo.addQuestion({
          text: 'Would you like me to <span>ORDER</span> an Uber now? Or would you like to see <span>MORE OPTIONS</span>?',
          quick_replies: [
            {
              title: 'ORDER UBER',
              payload: 'ORDER UBER',
            },
            {
              title: 'MORE OPTIONS',
              payload: 'MORE OPTIONS',
            }
          ]
        }, [
            {
              pattern: 'order uber',
              callback: function (response, convo) {
                convo.gotoThread('uber');
                convo.next();
              }
            },
            {
              pattern: 'more options',
              callback: function (response, convo) {
                convo.gotoThread('more_options');
                convo.next();
              }
            },
            {
              default: true,
              callback: function (response, convo) {
                convo.repeat();
                convo.next();
              }
            }
          ], {}, 'recommendation');

        var hos_1 = state.hos.data[1];
        var hos_2 = state.hos.data[2];
        var hos_3 = state.hos.data[3];
        var hos_4 = state.hos.data[4];
        var hos_5 = state.hos.data[5];
        var moreOptionsText = 'Here are the 5 next best options: </br> ' +
          '<strong>' + hos_1.name + '</strong>:</br>' + hos_1.waitingTime.text + ' </br>' +
          '<strong>' + hos_2.name + '</strong>:</br>' + hos_2.waitingTime.text + ' </br>' +
          '<strong>' + hos_3.name + '</strong>:</br>' + hos_3.waitingTime.text + ' </br>' +
          '<strong>' + hos_4.name + '</strong>:</br>' + hos_4.waitingTime.text + ' </br>' +
          '<strong>' + hos_5.name + '</strong>:</br>' + hos_5.waitingTime.text + ' </br>';

        convo.addMessage({
          text: moreOptionsText,
        }, 'more_options');
        convo.addMessage({
          text: 'Do you need any further assistance? Just say <span>HELP ME</span> to start again.',
        }, 'recommendation_bad');
        convo.addMessage({
          text: 'Do you need any further assistance? Just say <span>HELP ME</span> to start again.',
        }, 'more_options');
        convo.addMessage({
          text: 'Do you need any further assistance? Just say <span>HELP ME</span> to start again.',
        }, 'uber');
        //--------


      });
    } else {
      bot.startConversation(message, function (err, convo) {
        convo.ask({
          text: 'Is the bone visible through the skin?',
          quick_replies: [
            {
              title: 'YES',
              payload: 'YES',
            },
            {
              title: 'NO',
              payload: 'NO',
            }
          ]
        },
          [
            {
              pattern: 'yes',
              callback: function (res, convo) {
                convo.gotoThread('bone_visible');
                convo.next();
              }
            },
            {
              pattern: 'no',
              callback: function (res, convo) {
                convo.gotoThread('bone_invisible');
                convo.next();
              }
            },
          ]);

        convo.addMessage({
          text: 'You may require urgent medical attention. Please <strong><strong>dial 000</strong></strong> and speak to an emergency operator.',
        }, 'bone_visible');


        convo.addQuestion({
          text: 'Is your leg bleeding from the injury?',
          quick_replies: [
            {
              title: 'YES',
              payload: 'YES',
            },
            {
              title: 'NO',
              payload: 'NO',
            }
          ]
        }, [
            {
              pattern: 'yes',
              callback: function (response, convo) {
                convo.gotoThread('bleeding');
                convo.next();
              }
            },
            {
              pattern: 'no',
              callback: function (response, convo) {
                convo.gotoThread('bleeding');
                convo.next();
              }
            },
            {
              default: true,
              callback: function (response, convo) {
                convo.repeat();
                convo.next();
              }
            }
          ], {}, 'bone_invisible');

        convo.addQuestion({
          text: 'Is the area around the injury deformed?',
          quick_replies: [
            {
              title: 'YES',
              payload: 'YES',
            },
            {
              title: 'NO',
              payload: 'NO',
            }
          ]
        }, [
            {
              pattern: 'YES',
              callback: function (response, convo) {
                convo.gotoThread('touch');
                convo.next();
              }
            },
            {
              pattern: 'no',
              callback: function (response, convo) {
                convo.gotoThread('touch');
                convo.next();
              }
            },
            {
              default: true,
              callback: function (response, convo) {
                convo.repeat();
                convo.next();
              }
            }
          ], {}, 'bleeding');

        convo.addQuestion({
          text: 'Is the skin around the injury cold to touch?',
          quick_replies: [
            {
              title: 'YES',
              payload: 'yes',
            },
            {
              title: 'NO',
              payload: 'NO',
            }
          ]
        }, [
            {
              pattern: 'yes',
              callback: function (response, convo) {
                convo.gotoThread('pain');
                convo.next();
              }
            },
            {
              pattern: 'no',
              callback: function (response, convo) {
                convo.gotoThread('pain');
                convo.next();
              }
            },
            {
              default: true,
              callback: function (response, convo) {
                convo.repeat();
                convo.next();
              }
            }
          ], {}, 'touch');

        convo.addQuestion({
          text: 'How much pain are you experiencing now?',
          quick_replies: [
            {
              title: '<div style="font-size:24px;">😐</div>',
              payload: '😐',
            },
            {
              title: '<div style="font-size:24px;">😕</div>',
              payload: '😕',
            },
            {
              title: '<div style="font-size:24px;">☹️</div>',
              payload: '☹️',
            },
            {
              title: '<div style="font-size:24px;">😩</div>',
              payload: '😩',
            },
            {
              title: '<div style="font-size:24px;">😖</div>',
              payload: '😖',
            },
          ]
        }, [
            {
              pattern: '😐',
              callback: function (response, convo) {
                convo.gotoThread('recommendation');
                convo.next();
              }
            },
            {
              pattern: '😕',
              callback: function (response, convo) {
                convo.gotoThread('recommendation');
                convo.next();
              }
            },
            {
              pattern: '☹️',
              callback: function (response, convo) {
                convo.gotoThread('recommendation');
                convo.next();
              }
            },
            {
              pattern: '😩',
              callback: function (response, convo) {
                convo.gotoThread('recommendation');
                convo.next();
              }
            },
            {
              pattern: '😖',
              callback: function (response, convo) {
                convo.gotoThread('recommendation');
                convo.next();
              }
            },
            {
              default: true,
              callback: function (response, convo) {
                convo.repeat();
                convo.next();
              }
            }
          ], {}, 'pain');

        convo.addMessage({
          text: 'You should try and get to an emergency department. I\'m going to help you find one that is likely to get you treated in the least amount of time.',
        }, 'recommendation');

        var recommendationText = 'I recommend this hospital: <strong>' + state.hos.closest.name + '</strong>' +
          '. <br/> It is <strong>' + state.hos.closest.direction.distance.text + '</strong> from here.' +
          'The average wait time for your condition is <strong>' + state.hos.closest.direction.duration.text + ' </strong>. </br>' +
          'There are currently <strong>' + state.hos.closest.waitCount.toString() + ' people</strong> in the waiting room. </br> ' +
          'If I order an Uber now, I estimate that you will be treated within <strong>' + state.hos.closest.waitingTime.text + '</strong>.';
        convo.addMessage({
          text: recommendationText,
        }, 'recommendation');

        convo.addQuestion({
          text: 'Would you like me to <span>ORDER</span> an Uber now? Or would you like to see <span>MORE OPTIONS</span>?',
          quick_replies: [
            {
              title: 'ORDER UBER',
              payload: 'ORDER UBER',
            },
            {
              title: 'MORE OPTIONS',
              payload: 'MORE OPTIONS',
            }
          ]
        }, [
            {
              pattern: 'order uber',
              callback: function (response, convo) {
                convo.gotoThread('uber');
                convo.next();
              }
            },
            {
              pattern: 'more options',
              callback: function (response, convo) {
                convo.gotoThread('more_options');
                convo.next();
              }
            },
            {
              default: true,
              callback: function (response, convo) {
                convo.repeat();
                convo.next();
              }
            }
          ], {}, 'recommendation');

        var hos_1 = state.hos.data[1];
        var hos_2 = state.hos.data[2];
        var hos_3 = state.hos.data[3];
        var hos_4 = state.hos.data[4];
        var hos_5 = state.hos.data[5];
        var moreOptionsText = 'Here are the 5 next best options: </br> ' +
          '<strong>' + hos_1.name + '</strong>:</br>' + hos_1.waitingTime.text + ' </br>' +
          '<strong>' + hos_2.name + '</strong>:</br>' + hos_2.waitingTime.text + ' </br>' +
          '<strong>' + hos_3.name + '</strong>:</br>' + hos_3.waitingTime.text + ' </br>' +
          '<strong>' + hos_4.name + '</strong>:</br>' + hos_4.waitingTime.text + ' </br>' +
          '<strong>' + hos_5.name + '</strong>:</br>' + hos_5.waitingTime.text + ' </br>';

        convo.addMessage({
          text: moreOptionsText,
        }, 'more_options');
        convo.addMessage({
          text: 'Do you need any further assistance? Just say <span>HELP ME</span> to start again.',
        }, 'more_options');
        convo.addMessage({
          text: 'Do you need any further assistance? Just say <span>HELP ME</span> to start again.',
        }, 'uber');

      });
    }
  })




  function unhandledMessage(bot, message) {
    bot.startConversation(message, function (err, convo) {
      convo.addMessage({
        text: 'I\'m sorry, I didn\'t understand your response. Could you try repeating your answer?	or type <span>HELP ME</span> to start over',
      }, 'default');
    });

  }

  controller.on('hello', startConv);
  controller.on('welcome_back', startConv);
  controller.on('message_received', unhandledMessage);
}


