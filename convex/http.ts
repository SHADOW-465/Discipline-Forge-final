import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// Clerk webhook handler
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    // Get the headers
    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await request.text();
    const body = JSON.parse(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occured", {
        status: 400,
      });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      await ctx.runMutation(api.users.createOrUpdateUser, {
        name: `${first_name} ${last_name}`.trim(),
        email: email_addresses[0].email_address,
        imageUrl: image_url,
        clerkId: id,
        program: "solo", // Default program
        currentPhase: "getting_started",
        commitmentDuration: 7, // Default 7 days
      });
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      await ctx.runMutation(api.users.createOrUpdateUser, {
        name: `${first_name} ${last_name}`.trim(),
        email: email_addresses[0].email_address,
        imageUrl: image_url,
        clerkId: id,
        program: "solo", // This will be updated by the user later
        currentPhase: "getting_started",
        commitmentDuration: 7,
      });
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;
      if (id) {
        await ctx.runMutation(api.users.deleteUser, {
          clerkId: id,
        });
      }
    }

    return new Response("", { status: 200 });
  }),
});

export default http;