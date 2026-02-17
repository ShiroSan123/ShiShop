import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Mail, MapPin, Clock } from "lucide-react";

const contacts = [
  {
    icon: Send,
    title: "Telegram",
    value: "@ShiruiSan",
    href: "#",
    color: "from-blue-500 to-cyan-500",
    buttonText: "Написать",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+7 (993) 181-75-20",
    href: "#",
    color: "from-green-500 to-emerald-500",
    buttonText: "Написать",
  },
  {
    icon: Mail,
    title: "Email",
    value: "harlampevrenat@gmail.com",
    href: "mailto:harlampevrenat@gmail.com",
    color: "from-violet-500 to-purple-500",
    buttonText: "Написать",
  },
];

const info = [
  {
    icon: MapPin,
    title: "Локация",
    value: "Россия, Якутск",
  },
  {
    icon: Clock,
    title: "Время ответа",
    value: "Обычно в течение 1-2 часов",
  },
];

export default function Contacts() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Контакты
          </h1>
          <p className="text-xl text-slate-600">
            Свяжитесь со мной любым удобным способом
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid gap-6 mb-12">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <a
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center shadow-lg`}
                      >
                        <contact.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">
                          {contact.title}
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                          {contact.value}
                        </p>
                      </div>
                    </div>
                    <Button className="rounded-xl group-hover:bg-slate-800 transition-colors">
                      {contact.buttonText}
                    </Button>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white"
        >
          <h2 className="text-2xl font-bold mb-8">Дополнительная информация</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {info.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">{item.title}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-slate-300 leading-relaxed">
              Я всегда рад помочь с выбором или ответить на любые вопросы. Не
              стесняйтесь писать — обычно отвечаю в течение нескольких часов!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
