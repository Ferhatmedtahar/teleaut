"use client";

import { MessageSquare, Search, Users } from "lucide-react";

export default function ChatsPage() {
  return (
    <div className="flex items-center justify-center h-full bg-background">
      <div className="text-center max-w-md px-6">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-200 rounded-full flex items-center justify-center">
            <MessageSquare className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Select a chat to start messaging
        </h2>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Choose from your existing conversations or start a new chat with a
          doctor or patient.
        </p>

        {/* Feature cards */}
        <div className="cursor-default grid grid-cols-1 gap-4 text-left ">
          <div className="bg-backgorund hover:bg-secondary-400/40 dark:hover:bg-secondary-50/20 transition-colors duration-200 p-4 rounded-lg shadow-sm border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Group Chats</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Join group conversations with other doctors or patients to
                  share knowledge and experiences.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-backgorund hover:bg-secondary-400/40 dark:hover:bg-secondary-50/20 transition-colors duration-200  p-4 rounded-lg shadow-sm border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Direct Messages</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Have private conversations with doctors or patients. Visit
                  their profile to start chatting.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-backgorund p-4  hover:bg-secondary-400/40 dark:hover:bg-secondary-50/20 transition-colors duration-200 rounded-lg shadow-sm border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Find Users</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Browse through doctor or patient profiles to find the right
                  person to connect with.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
