const tree = [
  {
    children: [
      {
        children: [
          {
            id: 22263,
            name: "G_AI_0",
            type: "cmi",
            path: "TEST1212/03COM/G_AI_0",
            desc: "",
            graph: [
              {
                id: 3354369458765,
                hostId: 781,
                code: "VIEW3354369458765",
                name: "新建_图符12201658",
                desc: "",
                type: 5,
                creationTime: 1734685105610435,
                creator: "xulei",
                lastWriteTime: 1734686969097344,
                modifier: "xulei",
                resourcePath: "views/781/新建_图符12201658.pic",
                template: "",
                preview:
                  "data:image/png;base64,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",
                unsaved: false,
              },
            ],
          },
        ],
        id: 21338,
        name: "03COM",
        type: "cmi",
        path: "TEST1212/03COM",
        desc: "",
      },
      {
        children: [
          {
            id: 22163,
            name: "test12181",
            type: "cmi",
            path: "TEST1212/test1218/test12181",
            desc: "",
            graph: [
              {
                id: 95189360181277,
                hostId: 22163,
                code: "VIEW95189360181277",
                name: "新建_图符12181323",
                desc: "",
                type: 5,
                creationTime: 1734499405807293,
                creator: "xulei",
                lastWriteTime: 1734686440179195,
                modifier: "xulei",
                resourcePath: "views/22163/新建_图符12181323.pic.CACHE",
                template: "",
                preview:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAAA0CAYAAABipa0QAAAAAXNSR0IArs4c6QAAAt5JREFUeF7tnG1OwzAMhrPrFe0a/IE7bNwB/nCNiV0PFkSnzMQfaRy13t5JSGhNHPt9YidNp+5SSsfL36N9vlNKu40HfcMlO3ucpv1h4043uccRyHQ8P3Qczf7cXmt3Pp/eaALlvodp2h+fpr1nDLC1UIGv8ylxoDKkDGuhaXTzVACgPNUcaEsEldcolL6B6jeYRkY1iLVmU4BaU/2GsQGqQaw1mwLUmuo3jC2Bwn1Ug5CjmyKjRivsZN8N1Mvrc/p4//znVv6efmrtchvOBhdrzXZuO9svr0vfWexr/Wu+18Yvx9L8ExhfT6muZ33W+yhNZOm6FpA0KTmBSmHpxNB8pWJa+ksTlZuY3OQsbc3/k4y6Hh7/gmo5QprF7smWFgFnMbcEqsxmyb+WiUBA5a43Z75NoGZjWtZIM2tJ6WuZkVbhaPbSmKSJoU2aWmXQ+phAWY+QtgyKwuzN2jVAEcD9GSVlhUUgS5vajNc2K7Wa37IZ0/pL17WYXDLKukaVm4FanbaWNS0oa+ngytcS+6Xv0oahHLMs8dqYLqAspc9Sw+8ZlBa/M6j6E97L1jw/jherhDYjWhZxLailGTVPFC7bLWWQ29Vq8WsxWft3b8+1gXpBcQK12NXWTgtAqexJ91maPtbrIiit9JVrE3fnTtcv7l6D2xBIoGrjc9mhrS9Lbh20+KVMpetYbY2raffX7uZkIj/dVUufpWygTb8Cbmd9/a7AgqQAfjMRZH4AFEAFUSCIm8gogAqiQBA3kVEAFUSBIG66ZJR2et57PYiWQ93sBmU9qyqjKPto/YdGH8g4QAWB5QKKHrTSjOm5HkTH4W52g6IeLnn+wpXF4dEHGsAVFCCNIw9Q47R1tQxQrnKOM+YKapybsOwGyvLbBrr7o5sI6fqjowKoIDPADVSQeMO6CVBB0AEUQAVRIIibyCiACqJAEDeRUfcCKkgcD+Em+76+O4s+wmtILZLfvKr0B1q0x2IaUqXPAAAAAElFTkSuQmCC",
                lockedState: {
                  owner: "610cc7089883d775b7902681f2dc1269",
                },
                unsaved: false,
              },
            ],
          },
          {
            id: 22186,
            name: "test112182",
            type: "cmi",
            path: "TEST1212/test1218/test112182",
            desc: "",
            graph: [
              {
                id: 95288144429085,
                hostId: 22186,
                code: "VIEW95288144429085",
                name: "新建_图符12181325",
                desc: "",
                type: 5,
                creationTime: 1734499522453716,
                creator: "xulei",
                lastWriteTime: 1734680744999459,
                modifier: "xulei",
                resourcePath: "views/22186/新建_图符12181325.pic.CACHE",
                template: "",
                preview:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAAA0CAYAAAB2HPG0AAAAAXNSR0IArs4c6QAAA65JREFUeF7tnU2S2yAQhTXXU8rXyCa5wzh3SDa5xlR8vWRYMGHa0K8bJIzhuWrKYwH98/oTYFlVetm27fr+x5ddgb/btr3Yuy/Z80OjINR13y+vS8rQmHSkLKqZvkfTaZ/0WOgbXqH9qHEp9aWYLP5yfeSx+DmXQ2y73d5+hP9f9/1y/bJfGuXmcCrwX4E/t7ctAhbgCpBRHypwmAIE7DApaSinwCfAwh6MSyRBOVIBzmBHqklbdwoQMEJxqgIE7FR5aZyAkYFTFUgB43WwU6Ve0zhnsDXr3i3rasC+ff+6/fr5+y7QcFy+cv1Cn5INlL3mw9oWYkr7xhgt49N8cjZK8SN/0q7UDflC9ktxleqD6mBpr74OhuDQ2pFQWuA5u9ZjEerwngJWOlG0EwjBoEGWA8dyzHJSIi1QuwUaT5+mGSwWKucQAWgRy2rXI1qE+xkAy+mLdEVapO3IlgekUt8qwGJgaJZCU29NgtYxaAlvASyOTZdVlGssgIxLAwLBUnMCPhQw609FjwTMOvONCpiM/xGApWBaT4za2axpBtOKbZlpLH3Qhtn7BeKIJVLOXN480CyitSNfaNZDvmtBOnyJRGcBEsI6E6GEtZlK27yjWdhiF9lAG300y8bxni8UQwNmWSItewgrPBYIEWAlXwgQBAcan/r15qH5RvoiXx7ALNq29vl0Jf/9Vp1w27RqEyVQ2sxaN6QooVb/srgWkNKYcgDkvu1Z8rB+S/Qsa0gf1I7i9ra792DWANGZps08WsFa/Z8NWLBvAc4DNgLsyHYvQKi/60JrFC8VUB5LP+f2EBEsGZi8kq5t3ktjPbZT0Er5yPhz+csTpQUwpK9WzNKvCyg3y8mAINLa3UtkizOOXU8B9xK5nkTMuEUB1xLZ4ohj11SAgK1Z925ZE7BuUq/piICtWfduWROwblKv6YiArVn3blkTsG5Sr+moCjB5tV67dzx3pRiNX7MUc2btBgz9FtjaPqfM62ZFwNatfZfMqwCTy578Nb+lvUvWdNJNATdgMjJ0W05rezcl6OgUBZoAa4UHjT8lYxrtqgAB6yr3es4I2Ho175pxE2BdI6Wzp1SgGjB0a3Br+1OqyaDvFCBghOJUBaoBOzUqGp9GAQI2TSnHTISAjVmXaaIiYNOUcsxECNiYdZkmKgI2TSnHTISAjVmXaaK6A2yazJjIMAp8PC9ymIieIxD5MNkQtXzMcvpA25hVPBY+lx6W67VV+5BbbVwag3wYb+nBt8V8/gEV27JxI2nPkQAAAABJRU5ErkJggg==",
                lockedState: {
                  owner: "610cc7089883d775b7902681f2dc1269",
                },
                unsaved: false,
              },
              {
                id: 95288144429086,
                hostId: 22186,
                code: "VIEW95288144429086",
                name: "新建_图符12190938",
                desc: "",
                type: 5,
                creationTime: 1734572344159557,
                creator: "xulei",
                lastWriteTime: 1734572373881686,
                modifier: "xulei",
                resourcePath: "views/22186/新建_图符12190938.pic",
                template: "",
                preview:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAAA0CAYAAABipa0QAAAAAXNSR0IArs4c6QAAAt5JREFUeF7tnG1OwzAMhrPrFe0a/IE7bNwB/nCNiV0PFkSnzMQfaRy13t5JSGhNHPt9YidNp+5SSsfL36N9vlNKu40HfcMlO3ucpv1h4043uccRyHQ8P3Qczf7cXmt3Pp/eaALlvodp2h+fpr1nDLC1UIGv8ylxoDKkDGuhaXTzVACgPNUcaEsEldcolL6B6jeYRkY1iLVmU4BaU/2GsQGqQaw1mwLUmuo3jC2Bwn1Ug5CjmyKjRivsZN8N1Mvrc/p4//znVv6efmrtchvOBhdrzXZuO9svr0vfWexr/Wu+18Yvx9L8ExhfT6muZ33W+yhNZOm6FpA0KTmBSmHpxNB8pWJa+ksTlZuY3OQsbc3/k4y6Hh7/gmo5QprF7smWFgFnMbcEqsxmyb+WiUBA5a43Z75NoGZjWtZIM2tJ6WuZkVbhaPbSmKSJoU2aWmXQ+phAWY+QtgyKwuzN2jVAEcD9GSVlhUUgS5vajNc2K7Wa37IZ0/pL17WYXDLKukaVm4FanbaWNS0oa+ngytcS+6Xv0oahHLMs8dqYLqAspc9Sw+8ZlBa/M6j6E97L1jw/jherhDYjWhZxLailGTVPFC7bLWWQ29Vq8WsxWft3b8+1gXpBcQK12NXWTgtAqexJ91maPtbrIiit9JVrE3fnTtcv7l6D2xBIoGrjc9mhrS9Lbh20+KVMpetYbY2raffX7uZkIj/dVUufpWygTb8Cbmd9/a7AgqQAfjMRZH4AFEAFUSCIm8gogAqiQBA3kVEAFUSBIG66ZJR2et57PYiWQ93sBmU9qyqjKPto/YdGH8g4QAWB5QKKHrTSjOm5HkTH4W52g6IeLnn+wpXF4dEHGsAVFCCNIw9Q47R1tQxQrnKOM+YKapybsOwGyvLbBrr7o5sI6fqjowKoIDPADVSQeMO6CVBB0AEUQAVRIIibyCiACqJAEDeRUfcCKkgcD+Em+76+O4s+wmtILZLfvKr0B1q0x2IaUqXPAAAAAElFTkSuQmCC",
                lockedState: {
                  owner: "610cc7089883d775b7902681f2dc1269",
                },
                unsaved: false,
              },
            ],
          },
          {
            children: [
              {
                id: 22194,
                name: "test121831",
                type: "cmi",
                path: "TEST1212/test1218/test12183/test121831",
                desc: "",
                graph: [
                  {
                    id: 95322504167453,
                    hostId: 22194,
                    code: "VIEW95322504167453",
                    name: "新建_图符12181328",
                    desc: "",
                    type: 5,
                    creationTime: 1734499711685954,
                    creator: "xulei",
                    lastWriteTime: 1734499803123627,
                    modifier: "xulei",
                    resourcePath: "views/22194/新建_图符12181328.pic",
                    template: "",
                    preview:
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAAA0CAYAAAB4mU2eAAAAAXNSR0IArs4c6QAAApZJREFUeF7tnFtuwjAQRcP2UrGN/rR7gO6h/ek2UNleiyulMpbtOzO2yTS5SPxgz8P3jF8BcZim6Xx77+31PU3TwfOgQ3LneT6ePCepza2keKDR85XGQf6X/qjf9Xp5C31P83w8P83HnjnTl1GBr+tlWsAEKAGO0RXNeipAMD3V7OjrDkzYY7iUdVS3wRVnTIN4I00JZqS6Db4JpkG8kaYEM1LdBt8xGN5jGoTsbcoZ01vRTv5UYF5en7NhP94/fz+P22uflXLX2Ie+S4zFX84+joX8l/JK43TSvupGfY8pCRKDyAkmHRzyH0PI+czZp3Bq+Unjj4ajmjHLrBg5MKkwS/VriwD5j9sR5JFwhoPRDi7tXxMSiZwTDtm4BCN5JIMGls4qLRiJ/eJTkksKB9mk+6h0Ce49e0wzJk1Cu7ShQaCqrbWjQpCAqe2XKPde7SYwqIpqFS1JHNnXqnqTYKxLWWm5QCLVjs0BPqru3GEExUQ+kb2ksHr0ubv53x75h6+Xq36liZdOTdKkNacutPTt9rgsPf3El1DpcmjZvLV7HgIrLUZp0Un6qS6Y8dreImxIzGKfi5/uN5Lbe2mPKvlCuUqE1vZRL2XaAOxvU0B9KrOFoZVWAdVSpnXO/nYFCMau3VBLghkqr905wdi1G2pJMEPltTsnGLt2Qy0JZqi8ducmMOg7i9Z2+3C2Y6kGY3k66/FZlHeEBOOUkAlM+hAynREt7U51enhaajBphuiReGv7wxVxErAJTKvoyN6JRqukQTCryI6DEgzWaJUeTWBWyXgnQc1g0I8tWtt3on9xmATjtALMYJyOZzNpEYxTlARDME4VcJoWZwzBOFXAaVqcMf8FjNM8d5nW3/+VbWz07v9WUaL3Dwk5WmLx27UXAAAAAElFTkSuQmCC",
                    lockedState: {
                      owner: "610cc7089883d775b7902681f2dc1269",
                    },
                    unsaved: false,
                  },
                  {
                    id: 95322504167454,
                    hostId: 22194,
                    code: "VIEW95322504167454",
                    name: "新建_图符12190939",
                    desc: "",
                    type: 5,
                    creationTime: 1734572410389417,
                    creator: "xulei",
                    lastWriteTime: 1734572467992173,
                    modifier: "xulei",
                    resourcePath: "views/22194/新建_图符12190939.pic",
                    template: "",
                    preview:
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAAA0CAYAAABipa0QAAAAAXNSR0IArs4c6QAAAt5JREFUeF7tnG1OwzAMhrPrFe0a/IE7bNwB/nCNiV0PFkSnzMQfaRy13t5JSGhNHPt9YidNp+5SSsfL36N9vlNKu40HfcMlO3ucpv1h4043uccRyHQ8P3Qczf7cXmt3Pp/eaALlvodp2h+fpr1nDLC1UIGv8ylxoDKkDGuhaXTzVACgPNUcaEsEldcolL6B6jeYRkY1iLVmU4BaU/2GsQGqQaw1mwLUmuo3jC2Bwn1Ug5CjmyKjRivsZN8N1Mvrc/p4//znVv6efmrtchvOBhdrzXZuO9svr0vfWexr/Wu+18Yvx9L8ExhfT6muZ33W+yhNZOm6FpA0KTmBSmHpxNB8pWJa+ksTlZuY3OQsbc3/k4y6Hh7/gmo5QprF7smWFgFnMbcEqsxmyb+WiUBA5a43Z75NoGZjWtZIM2tJ6WuZkVbhaPbSmKSJoU2aWmXQ+phAWY+QtgyKwuzN2jVAEcD9GSVlhUUgS5vajNc2K7Wa37IZ0/pL17WYXDLKukaVm4FanbaWNS0oa+ngytcS+6Xv0oahHLMs8dqYLqAspc9Sw+8ZlBa/M6j6E97L1jw/jherhDYjWhZxLailGTVPFC7bLWWQ29Vq8WsxWft3b8+1gXpBcQK12NXWTgtAqexJ91maPtbrIiit9JVrE3fnTtcv7l6D2xBIoGrjc9mhrS9Lbh20+KVMpetYbY2raffX7uZkIj/dVUufpWygTb8Cbmd9/a7AgqQAfjMRZH4AFEAFUSCIm8gogAqiQBA3kVEAFUSBIG66ZJR2et57PYiWQ93sBmU9qyqjKPto/YdGH8g4QAWB5QKKHrTSjOm5HkTH4W52g6IeLnn+wpXF4dEHGsAVFCCNIw9Q47R1tQxQrnKOM+YKapybsOwGyvLbBrr7o5sI6fqjowKoIDPADVSQeMO6CVBB0AEUQAVRIIibyCiACqJAEDeRUfcCKkgcD+Em+76+O4s+wmtILZLfvKr0B1q0x2IaUqXPAAAAAElFTkSuQmCC",
                    lockedState: {
                      owner: "610cc7089883d775b7902681f2dc1269",
                    },
                    unsaved: false,
                  },
                ],
              },
            ],
            id: 22190,
            name: "test12183",
            type: "cmi",
            path: "TEST1212/test1218/test12183",
            desc: "",
          },
        ],
        id: 22159,
        name: "test1218",
        type: "cmi",
        path: "TEST1212/test1218",
        desc: "",
        graph: [
          {
            id: 95172180312093,
            hostId: 22159,
            code: "VIEW95172180312093",
            name: "新建_图符12190936",
            desc: "",
            type: 5,
            creationTime: 1734572217895161,
            creator: "xulei",
            lastWriteTime: 1734572267771909,
            modifier: "xulei",
            resourcePath: "views/22159/新建_图符12190936.pic",
            template: "",
            preview:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAAA0CAYAAAB4mU2eAAAAAXNSR0IArs4c6QAAAtBJREFUeF7tnE1y2zAMhenrKeNrdNPeIe4d2k2vkYmv15gLZmhYJB4EkJGc55ksMiIewO+JoH48PqWULre/7/b5n1I67XnSubjLspxf91yktbYW8exG5Efm0fTLeG3c9fr2O499XZbz5WU5R9ZMrY0E3q9vqRiTTcnmbJRiWCQBGhNJM1Drzpi8x7CVBdJ1SHHFOOCNDKUxI+k6tGmMA97IUBozkq5DuzaG9zEOkNGhXDHRRIP0TMb8/PXjIe3fP/+CStFl6vy9vGXcyNqQHHnM1hrM9zEymSe5bsXjCCQfAm0tNxpX17BWD3oC9eZvWjFZqFWI9cxAALfgWXNZTgCtLsv8NS0aY3BGg/klxiCPZJDCeksZ2ae0eGR/yV7IcXWrauWQbap4WrSQ+ZcYzeSpKwbdg1pFa/HoZHv60rTWnoGagM7FsHDT0D2mt5kigNfikbjWXojskUXfAtsyFjXHfVW2NlnZMtZaTw9wL36GMbJ91TDRVdQ7ORBz7u78b4/88+vlbpxWmNaKtP6rxc8wxrqfDF8xyBtMCzi0lfV6fG8/6JlsgdXKb2l90Zf2plZWQNdFtNpUAaqZg1495Txr+deumiSkegUg42XtWo0yH8oJvSrLby/VVob0R47xEzBflflTUgEhYGpliCDHxBCgMTEcw1VoTDjSGEEaE8MxXIXGhCONEaQxMRzDVWhMONIYwU3GyDvb1nsPeZdd/tfiY6Z2bBWzMdaHmBlP71mUPH5snHHV05g4lqFKm4zJFdTtS64Iz/HQ2R1YzGyMnKv2fsR7/MBsXaW7jPFC1+JdMzt4MI3ZqYE05hmN2emcnqKszSum98q43JvIq7OamBb/FHQdk6AxDngjQzcbM7Ioaqf7b2Ii310mtDkEuGLmcDZnoTFmZHMCaMwczuYsNMaMbE4AjZnD2ZzlwRizAgOGEfj8vbJhGb5GePc/q4hg+QBgboFiUhu87QAAAABJRU5ErkJggg==",
            lockedState: {
              owner: "610cc7089883d775b7902681f2dc1269",
            },
            unsaved: false,
          },
          {
            id: 95172180312094,
            hostId: 22159,
            code: "VIEW95172180312094",
            name: "新建_图符12190937",
            desc: "",
            type: 5,
            creationTime: 1734572279120120,
            creator: "xulei",
            lastWriteTime: 1734673306768307,
            modifier: "xulei",
            resourcePath: "views/22159/新建_图符12190937.pic.CACHE",
            template: "",
            preview:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAA0CAYAAABFCyz4AAAAAXNSR0IArs4c6QAAAzxJREFUeF7tnU1y4yAQhZXracrXmE3mDvHcYWaTa6TG10vCginSAd6jBYK221VZROrf9wHCskt+2rbt+vn3aK/3bdueRNO5YxZ1yfYRmr3u++XFYkcjao70g1qlVzpCtHYhRupbysvY5XzTY7fb2+/w/8u+X64/9ssI3TzmZAX+3d62CDpADrAnl+TpRyjgoEeoumDML6DDNdqX7gUpdSjJZ3QHES2EcNAWKHWo0UF3ENFCCAdtgVKHGlPQ/j66g6CrhvAZvSqZznWpQT//+rn9/fP6rZxwXL5ydsGmFKPUYy52sI3x0/O1Y0x85J+rPZc/zYXqK9VV0q9lLKjfRyNItfNIkFoDJYFTMFIYVKuEwfjXBnoNzOj6S9odmtHpbJIJGHEZGyZuGgcJiWYB6x8HKzMoWgYS6gXV3xV0LAbNWrTknAG6NYe0r4FnB8VyoNlboCuDltf+VtCMf61/lA8NDrkPQZOFneGqpZtZXlDDms1Y9EGbPaY+dh/AgElhoL5b4qFYLORgpwadJintvtFo1DTC+DArDgO6tuEq9Y/qWwI0s3Qz1zB2tiJRcjAYn5GgUf+ovhbQLTMW2X65M/b5EWX4OlHVBxUanVHD7GBgdt2lAVF7V4CEiddKZlfdcqlA+qHzqO5uu262EC3oksAtA6g2iFB8lAf1P/p8F9Bo6Y4ipTNFHkv/j0XlZkVpQ1UDkctfahxdXzX7B9R/DYLcsOWu8TntjqxKaY7mpVs7otxvrgKqXffckj27RgH1vW5NMveZp4CDnqf9qZkd9Klyz0vmoOdpf2pmB32q3POSOeh52p+a2UGfKve8ZCrQ8g4OuvPVen6eHPebuRn0qvdy7xdRn84cdB8dl4+iAi1vtMuP6Y6cX14xowU2g5Z9oo8jj543qutyZR8CfRQi8l9OLcMFOWjD8FpKd9Atahm2PQTacN8PV7oaNPru1dHzD0dicMMOerDAq4RXg16lAa+DU8BBczqZt3LQ5hFyDThoTifzVg7aPEKuAQfN6WTeykGbR8g18A0052bfSj7o3H5HuIP/z+vGpndlER98Lx+kL396ITade1A+EqTkU/o5h5p9yJWrLddHsM0e/wAf8uliLFtS0AAAAABJRU5ErkJggg==",
            lockedState: {
              owner: "610cc7089883d775b7902681f2dc1269",
            },
            unsaved: false,
          },
        ],
      },
    ],
    id: 21335,
    name: "TEST1212",
    type: "AREA",
    path: "",
    desc: "",
  },
];

// Tree筛选节点
const treeTraversalFilter = (treeNode, predicate) => {
  // 如果传入的是数组，则对数组中的每个元素进行筛选
  if (Array.isArray(treeNode)) {
    return treeNode
      .map((node) => treeTraversalFilter(node, predicate))
      .filter(Boolean);
  }

  // 创建一个新的节点对象，避免直接修改参数
  const newNode = { ...treeNode };

  const newNodeFilterRes = predicate(newNode);

  // 【1】若当前节点满足筛选条件，则后代也直接满足
  if (newNodeFilterRes) {
    return newNode;
  }
  // 【2】若当前节点不满足筛选条件，则看其子节点是否满足
  if (Array.isArray(newNode?.children) && newNode?.children?.length) {
    // 如果当前节点有子节点，则递归筛选子节点
    newNode.children = newNode.children
      .map((child) => treeTraversalFilter(child, predicate))
      .filter(Boolean);
  }

  // 【3】若当前节点不满足筛选条件，且其子节点也没有满足的，则返回null
  if (!newNode.children?.length) {
    return null;
  }

  return newNode;
};

let keyword = "COM";

const lowcasedKeyword = keyword.toLowerCase();

const handledComponentToolPreviewsOMC = treeTraversalFilter(
  clonedTreeData,
  (treeNode) => {
    // [0] 若当前CM节点名称包含关键词，则返回该节点
    if (treeNode.name?.toLowerCase?.()?.includes?.(lowcasedKeyword)) {
      return true;
    }
    // [1] 若当前CM节点下的图符列表中图符的名称包含关键词，则返回该节点
    if (Array.isArray(treeNode?.graph) && treeNode?.graph.length > 0) {
      return treeNode?.graph?.some((graphItem) => {
        return graphItem.name?.toLowerCase?.()?.includes?.(lowcasedKeyword);
      });
    }
    return false;
  }
);

console.log(
  "handledComponentToolPreviewsOMC :>> ",
  handledComponentToolPreviewsOMC
);
console.log(
  "handledComponentToolPreviewsOMC :>> ",
  handledComponentToolPreviewsOMC[0].children[0].children[0]
);
